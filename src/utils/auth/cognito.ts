/**
 * AWS Cognito auth for the website — drop-in replacement for the old Supabase authHelpers
 * (17 Nov 2026, Phase 2 of the website build).
 *
 * The website now signs in against the SAME Cognito user pool as the iOS app, so one account
 * works in both. The exported API deliberately mirrors the Supabase shapes the app already
 * consumes ({ data, error }, session.user.{id,email,user_metadata.name}, onAuthStateChange),
 * which keeps App.tsx and AuthScreens changes small.
 *
 * Differences from Supabase the UI must handle:
 *  - Sign-up requires a 6-digit email confirmation code (confirmSignUp), then we auto sign in.
 *  - Password reset is code-based (resetPassword sends the code, confirmResetPassword applies
 *    it) — there is no emailed magic link and no /reset-password redirect.
 *
 * The session's access_token is the Cognito ID TOKEN — the same token the iOS app sends —
 * and the backend verifies it against the pool's JWKS (AUTH_MODE, cognitoVerify.js).
 */
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js';

// Same pool + app client as the iOS app (BrandScaling/amplifyconfiguration.json).
// A dedicated web app client can replace CLIENT_ID later without code changes elsewhere.
const USER_POOL_ID = (import.meta as any).env?.VITE_COGNITO_USER_POOL_ID || 'us-east-1_u8tyHoqJi';
const CLIENT_ID = (import.meta as any).env?.VITE_COGNITO_CLIENT_ID || '7p2sthlo5p654mi99gcr8rjhtd';

const pool = new CognitoUserPool({ UserPoolId: USER_POOL_ID, ClientId: CLIENT_ID });

// ---------- Supabase-shaped types ----------
export interface AuthUser {
  id: string; // Cognito sub
  email: string;
  user_metadata: { name?: string };
}
export interface AuthSession {
  user: AuthUser;
  access_token: string; // Cognito ID token (what the backend verifies)
}
type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'INITIAL_SESSION';
type Listener = (event: AuthChangeEvent, session: AuthSession | null) => void;

const listeners = new Set<Listener>();
function notify(event: AuthChangeEvent, session: AuthSession | null) {
  listeners.forEach((l) => {
    try { l(event, session); } catch (e) { console.error('auth listener error', e); }
  });
}

function toSession(cs: CognitoUserSession): AuthSession {
  const idToken = cs.getIdToken();
  const p = idToken.payload as Record<string, any>;
  return {
    user: {
      id: p.sub,
      email: p.email || '',
      user_metadata: { name: p.name || p.given_name || undefined },
    },
    access_token: idToken.getJwtToken(),
  };
}

function userFor(email: string): CognitoUser {
  return new CognitoUser({ Username: email.trim().toLowerCase(), Pool: pool });
}

/** Current valid session, refreshing with the stored refresh token when needed. */
function currentSession(): Promise<AuthSession | null> {
  return new Promise((resolve) => {
    const u = pool.getCurrentUser();
    if (!u) return resolve(null);
    u.getSession((err: Error | null, s: CognitoUserSession | null) => {
      if (err || !s || !s.isValid()) return resolve(null);
      resolve(toSession(s));
    });
  });
}

export const authHelpers = {
  async getSession(): Promise<{ session: AuthSession | null; error: Error | null }> {
    try {
      return { session: await currentSession(), error: null };
    } catch (err: any) {
      return { session: null, error: err };
    }
  },

  async getUser(): Promise<{ user: AuthUser | null; error: Error | null }> {
    const { session, error } = await this.getSession();
    return { user: session?.user ?? null, error };
  },

  signIn(email: string, password: string): Promise<{ data: { user: AuthUser | null; session: AuthSession | null }; error: Error | null }> {
    return new Promise((resolve) => {
      const u = userFor(email);
      u.authenticateUser(
        new AuthenticationDetails({ Username: email.trim().toLowerCase(), Password: password }),
        {
          onSuccess: (s) => {
            const session = toSession(s);
            notify('SIGNED_IN', session);
            resolve({ data: { user: session.user, session }, error: null });
          },
          onFailure: (err) => resolve({ data: { user: null, session: null }, error: err }),
          newPasswordRequired: () =>
            resolve({
              data: { user: null, session: null },
              error: new Error('A new password is required for this account. Please use “Forgot password”.'),
            }),
        }
      );
    });
  },

  /**
   * Settings · Change email (25 Nov): confirms the person's current password before the
   * address is changed. Same check as signIn, but it does not announce a new sign-in to the
   * app (no SIGNED_IN event), so the page the person is on stays where it is.
   */
  verifyPassword(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      userFor(email).authenticateUser(
        new AuthenticationDetails({ Username: email.trim().toLowerCase(), Password: password }),
        { onSuccess: () => resolve(true), onFailure: () => resolve(false), newPasswordRequired: () => resolve(false) }
      );
    });
  },

  /** A fresh ID token from the refresh token, e.g. after the email attribute changed. */
  refreshIdToken(): Promise<string | null> {
    return new Promise((resolve) => {
      const u = pool.getCurrentUser();
      if (!u) return resolve(null);
      u.getSession((err: Error | null, s: CognitoUserSession | null) => {
        if (err || !s) return resolve(null);
        u.refreshSession(s.getRefreshToken(), (e: Error | null, ns: CognitoUserSession | null) => {
          if (e || !ns) return resolve(null);
          resolve(ns.getIdToken().getJwtToken());
        });
      });
    });
  },

  /**
   * Registers the user. Cognito then emails a 6-digit confirmation code: the UI must call
   * confirmSignUp(email, code) and then signIn again. `data.needsConfirmation` says so.
   */
  signUp(email: string, password: string, name: string): Promise<{ data: { user: { email: string } | null; needsConfirmation: boolean }; error: Error | null }> {
    return new Promise((resolve) => {
      const attrs = [
        new CognitoUserAttribute({ Name: 'email', Value: email.trim().toLowerCase() }),
        new CognitoUserAttribute({ Name: 'name', Value: name }),
      ];
      pool.signUp(email.trim().toLowerCase(), password, attrs, [], (err, result) => {
        if (err) return resolve({ data: { user: null, needsConfirmation: false }, error: err });
        resolve({
          data: {
            user: { email: email.trim().toLowerCase() },
            needsConfirmation: !(result?.userConfirmed ?? false),
          },
          error: null,
        });
      });
    });
  },

  confirmSignUp(email: string, code: string): Promise<{ error: Error | null }> {
    return new Promise((resolve) => {
      userFor(email).confirmRegistration(code.trim(), true, (err) => resolve({ error: err ?? null }));
    });
  },

  resendConfirmationCode(email: string): Promise<{ error: Error | null }> {
    return new Promise((resolve) => {
      userFor(email).resendConfirmationCode((err) => resolve({ error: err ?? null }));
    });
  },

  /** Starts the password reset: Cognito emails a 6-digit code. */
  resetPassword(email: string): Promise<{ error: Error | null }> {
    return new Promise((resolve) => {
      userFor(email).forgotPassword({
        onSuccess: () => resolve({ error: null }),
        onFailure: (err) => resolve({ error: err }),
        inputVerificationCode: () => resolve({ error: null }),
      });
    });
  },

  confirmResetPassword(email: string, code: string, newPassword: string): Promise<{ error: Error | null }> {
    return new Promise((resolve) => {
      userFor(email).confirmPassword(code.trim(), newPassword, {
        onSuccess: () => resolve({ error: null }),
        onFailure: (err) => resolve({ error: err }),
      });
    });
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      pool.getCurrentUser()?.signOut();
      notify('SIGNED_OUT', null);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },

  /** Supabase-shaped subscription. Fires INITIAL_SESSION once with the restored session. */
  onAuthStateChange(cb: Listener): { data: { subscription: { unsubscribe: () => void } } } {
    listeners.add(cb);
    currentSession().then((s) => cb('INITIAL_SESSION', s));
    return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
  },
};

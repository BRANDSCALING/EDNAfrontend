/**
 * AuthScreens — sign in / register / confirm / reset, against AWS Cognito (the same user pool
 * as the iOS app; see utils/auth/cognito.ts).
 *
 * 17 Nov 2026 (Phase 5): presentation rebuilt per BS-BRAND-001 and Mockup 04 (Login Screen).
 * Cognito flows are code-based: sign-up emails a 6-digit code ('confirm-code'), and password
 * reset is code + new password in-page ('reset-code').
 */
import { useState } from 'react';
import { authHelpers } from '../utils/auth/cognito';

interface AuthScreensProps {
  onAuthenticate: (user: { email: string; name: string }) => void;
  onCancel: () => void;
  initialMode?: 'login' | 'register' | 'forgot-password' | 'reset-success';
}

type AuthMode = 'login' | 'register' | 'confirm-code' | 'forgot-password' | 'reset-code' | 'reset-success';

export function AuthScreens({ onAuthenticate, onCancel, initialMode = 'login' }: AuthScreensProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', firstName: '', lastName: '', code: ''
  });
  /* age consent on sign-up (Fariza, 19 Nov 2026: "sign up page before assessment") */
  const [over18, setOver18] = useState(false);

  const set = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setError(''); setNotice('');
  };

  const validate = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address'); return false;
    }
    if (mode === 'register') {
      if (!formData.firstName || !formData.lastName) { setError('Please enter your full name'); return false; }
      if (formData.password.length < 8) { setError('Password must be at least 8 characters long'); return false; }
      if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
      if (!over18) { setError('Please confirm that you are over 18 years old'); return false; }
    } else if (mode === 'login') {
      if (!formData.password) { setError('Please enter your password'); return false; }
    } else if (mode === 'confirm-code') {
      if (!formData.code || formData.code.trim().length < 6) { setError('Please enter the 6-digit code from your email'); return false; }
    } else if (mode === 'reset-code') {
      if (!formData.code || formData.code.trim().length < 6) { setError('Please enter the 6-digit code from your email'); return false; }
      if (formData.password.length < 8) { setError('Password must be at least 8 characters long'); return false; }
      if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
    }
    return true;
  };

  /* An UNCONFIRMED account is a Cognito dead-end (cannot sign in, cannot reset the password,
   * cannot re-register). The way out is always the same: email a fresh confirmation code and
   * finish the confirmation (18 Nov 2026 — hit by accounts left half-registered since April). */
  const recoverUnconfirmed = async (noticeText: string) => {
    const { error } = await authHelpers.resendConfirmationCode(formData.email);
    if (error) return false;
    setError('');
    setNotice(noticeText);
    setMode('confirm-code');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true); setError('');
    try {
      if (mode === 'login') {
        const { data, error } = await authHelpers.signIn(formData.email, formData.password);
        if (error) {
          const name = (error as any).name || (error as any).code || '';
          if (name === 'UserNotConfirmedException' || (error.message || '').toLowerCase().includes('not confirmed')) {
            if (await recoverUnconfirmed('Your account was never confirmed. We have emailed you a 6-digit code — enter it below to finish setting up.')) {
              setIsLoading(false); return;
            }
          }
          setError(error.message || 'Invalid email or password'); setIsLoading(false); return;
        }
        if (data.user) onAuthenticate({ email: data.user.email || '', name: data.user.user_metadata?.name || 'User' });
      } else if (mode === 'register') {
        const fullName = `${formData.firstName} ${formData.lastName}`;
        const { data, error } = await authHelpers.signUp(formData.email, formData.password, fullName);
        if (error) {
          const name = (error as any).name || (error as any).code || '';
          const msg = error.message || 'Registration failed';
          if (name === 'UsernameExistsException' || msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
            /* An existing account goes straight to sign-in — resending a code here let a
               member "register" over a confirmed account and then fail with the new
               password (Fiza, 23 Nov 2026). A half-finished registration still recovers:
               sign-in answers UserNotConfirmedException and the login path resends the
               code from there. */
            setError('');
            setNotice('You already have an account with this email. Sign in below — or use "Forgot password?" if you do not remember your password.');
            setMode('login');
          } else setError(msg);
          setIsLoading(false); return;
        }
        if (data.needsConfirmation) setMode('confirm-code');
        else if (data.user) {
          const { data: si, error: siErr } = await authHelpers.signIn(formData.email, formData.password);
          if (siErr || !si.user) { setError(siErr?.message || 'Account created — please sign in.'); setMode('login'); }
          else onAuthenticate({ email: si.user.email, name: si.user.user_metadata?.name || fullName });
        }
      } else if (mode === 'confirm-code') {
        const { error } = await authHelpers.confirmSignUp(formData.email, formData.code);
        if (error) {
          /* "User cannot be confirmed. Current status is CONFIRMED" — the account is fine */
          if (/already\s+confirmed|status is confirmed/i.test(error.message || '')) {
            setNotice('Your account is already confirmed. Sign in below — or use "Forgot password?" if you do not remember your password.');
            setMode('login'); setIsLoading(false); return;
          }
          setError(error.message || 'That code was not accepted. Check it and try again.'); setIsLoading(false); return;
        }
        if (!formData.password) {
          /* reached from the forgot-password recovery: confirmed, but no password typed */
          setNotice('Your account is confirmed. Sign in — or use "Forgot password?" if you do not remember your password.');
          setMode('login'); setIsLoading(false); return;
        }
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const { data: si, error: siErr } = await authHelpers.signIn(formData.email, formData.password);
        if (siErr || !si.user) {
          setNotice('Your account is confirmed. Sign in — or use "Forgot password?" if you do not remember your password.');
          setMode('login');
        }
        else onAuthenticate({ email: si.user.email, name: si.user.user_metadata?.name || fullName || 'User' });
      } else if (mode === 'forgot-password') {
        const { error } = await authHelpers.resetPassword(formData.email);
        if (error) {
          const msg = (error.message || '').toLowerCase();
          if (msg.includes('verified email') || msg.includes('no registered')) {
            /* unconfirmed account: confirm it first, then the reset works */
            if (await recoverUnconfirmed('This account was never confirmed, so we need to confirm it first. Enter the 6-digit code we just emailed you; after that you can reset your password.')) {
              setIsLoading(false); return;
            }
          }
          setError(error.message || 'Failed to send the reset code'); setIsLoading(false); return;
        }
        setFormData((p) => ({ ...p, password: '', confirmPassword: '', code: '' }));
        setMode('reset-code');
      } else if (mode === 'reset-code') {
        const { error } = await authHelpers.confirmResetPassword(formData.email, formData.code, formData.password);
        if (error) { setError(error.message || 'Could not reset the password. Check the code and try again.'); setIsLoading(false); return; }
        setMode('reset-success');
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const resend = async () => {
    setError(''); setNotice('');
    const { error } = await authHelpers.resendConfirmationCode(formData.email);
    if (error) setError(error.message || 'Could not resend the code');
    else setNotice('A new code has been sent.');
  };

  const title =
    mode === 'login' ? 'Sign in to your account'
    : mode === 'register' ? 'Create your account'
    : mode === 'confirm-code' ? 'Confirm your email'
    : mode === 'forgot-password' ? 'Reset your password'
    : mode === 'reset-code' ? 'Enter your reset code'
    : 'Password changed';

  const emailField = (
    <div className="bs-field">
      <label htmlFor="bs-email">Email</label>
      <input id="bs-email" className="bs-input" type="email" placeholder="you@company.com"
        value={formData.email} onChange={(e) => set('email', e.target.value)} required />
    </div>
  );

  const passwordField = (label: string, placeholder: string) => (
    <div className="bs-field">
      <label htmlFor="bs-password">{label}</label>
      <input id="bs-password" className="bs-input" type={showPassword ? 'text' : 'password'}
        placeholder={placeholder} value={formData.password}
        onChange={(e) => set('password', e.target.value)} required />
      <div className="bs-auth-small">
        <button type="button" className="bs-link-btn" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? 'Hide password' : 'Show password'}
        </button>
      </div>
    </div>
  );

  const confirmPasswordField = (label: string) => (
    <div className="bs-field">
      <label htmlFor="bs-confirm">{label}</label>
      <input id="bs-confirm" className="bs-input" type="password" placeholder="Repeat the password"
        value={formData.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} required />
    </div>
  );

  const codeField = (
    <div className="bs-field">
      <label htmlFor="bs-code">6-digit code</label>
      <input id="bs-code" className="bs-input" inputMode="numeric" placeholder="123456"
        value={formData.code} onChange={(e) => set('code', e.target.value)} required />
      <p className="bs-auth-small">We've emailed a 6-digit code to {formData.email}</p>
    </div>
  );

  const alerts = (
    <>
      {error && <div className="bs-auth-error">{error}</div>}
      {notice && <div className="bs-auth-note">{notice}</div>}
    </>
  );

  return (
    <div className="bs-auth-bg">
      <div className="bs-auth-card">
        <img src="/edna/img/logo.png" alt="Brandscaling" className="bs-auth-logo" />
        <h1 className="bs-auth-title">{title}</h1>

        {mode === 'login' && (
          <form onSubmit={handleSubmit}>
            {emailField}
            {passwordField('Password', 'Your password')}
            <div className="bs-auth-row">
              <span />
              <button type="button" className="bs-link-btn" onClick={() => setMode('forgot-password')}>Forgot password?</button>
            </div>
            {alerts}
            <button type="submit" className="bs-btn bs-btn-action bs-btn-block" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
            <hr className="bs-auth-divider" />
            <p className="bs-auth-foot">
              New here?{' '}
              <button type="button" className="bs-link-btn" onClick={() => setMode('register')}>
                Take the free E-DNA assessment
              </button>
            </p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="bs-field">
                <label htmlFor="bs-first">First name</label>
                <input id="bs-first" className="bs-input" placeholder="First name"
                  value={formData.firstName} onChange={(e) => set('firstName', e.target.value)} required />
              </div>
              <div className="bs-field">
                <label htmlFor="bs-last">Last name</label>
                <input id="bs-last" className="bs-input" placeholder="Last name"
                  value={formData.lastName} onChange={(e) => set('lastName', e.target.value)} required />
              </div>
            </div>
            {emailField}
            {passwordField('Password', 'At least 8 characters')}
            {confirmPasswordField('Confirm password')}
            <div className="bs-auth-row" style={{ justifyContent: 'flex-start' }}>
              <label>
                <input type="checkbox" checked={over18} onChange={(e) => setOver18(e.target.checked)} />
                <span>I'm over 18 years old</span>
              </label>
            </div>
            {alerts}
            <button type="submit" className="bs-btn bs-btn-action bs-btn-block" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
            <hr className="bs-auth-divider" />
            <p className="bs-auth-foot">
              Already have an account?{' '}
              <button type="button" className="bs-link-btn" onClick={() => setMode('login')}>Sign in</button>
            </p>
          </form>
        )}

        {mode === 'confirm-code' && (
          <form onSubmit={handleSubmit}>
            {codeField}
            {alerts}
            <button type="submit" className="bs-btn bs-btn-action bs-btn-block" disabled={isLoading}>
              {isLoading ? 'Confirming…' : 'Confirm email'}
            </button>
            <hr className="bs-auth-divider" />
            <p className="bs-auth-foot">
              Nothing arrived?{' '}
              <button type="button" className="bs-link-btn" onClick={resend}>Resend the code</button>
            </p>
          </form>
        )}

        {mode === 'forgot-password' && (
          <form onSubmit={handleSubmit}>
            {emailField}
            <p className="bs-auth-small" style={{ marginBottom: 16 }}>We'll email you a 6-digit code to reset your password.</p>
            {alerts}
            <button type="submit" className="bs-btn bs-btn-action bs-btn-block" disabled={isLoading}>
              {isLoading ? 'Sending…' : 'Send reset code'}
            </button>
            <hr className="bs-auth-divider" />
            <p className="bs-auth-foot">
              <button type="button" className="bs-link-btn" onClick={() => setMode('login')}>← Back to sign in</button>
            </p>
          </form>
        )}

        {mode === 'reset-code' && (
          <form onSubmit={handleSubmit}>
            {codeField}
            {passwordField('New password', 'At least 8 characters')}
            {confirmPasswordField('Confirm new password')}
            {alerts}
            <button type="submit" className="bs-btn bs-btn-action bs-btn-block" disabled={isLoading}>
              {isLoading ? 'Resetting…' : 'Reset password'}
            </button>
            <hr className="bs-auth-divider" />
            <p className="bs-auth-foot">
              <button type="button" className="bs-link-btn" onClick={() => setMode('login')}>← Back to sign in</button>
            </p>
          </form>
        )}

        {mode === 'reset-success' && (
          <div>
            <p className="bs-auth-foot" style={{ marginBottom: 20 }}>
              Your password has been reset. You can now sign in with your new password.
            </p>
            <button className="bs-btn bs-btn-action bs-btn-block" onClick={() => setMode('login')}>Back to sign in</button>
          </div>
        )}

        <p className="bs-auth-foot" style={{ marginTop: 22 }}>
          <button type="button" className="bs-link-btn" onClick={onCancel}>← Back to the homepage</button>
        </p>
      </div>
      <p className="bs-auth-tag">Decision Intelligence &amp; Infinite Scaling Mastery</p>
    </div>
  );
}

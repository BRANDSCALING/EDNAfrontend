/**
 * E-DNA state for the site (17 Nov 2026): reads the SAME record the iOS app and the /edna
 * assessment write — GET /api/v1/quiz/results/:userId on the shared backend, with the full v2
 * record embedded in layer7Result under "ednaV2".
 */
import { authHelpers } from './auth/cognito';

// The shared Brandscaling API (the iOS backend). Overridable per environment.
export const EDNA_API_BASE =
  (import.meta as any).env?.VITE_EDNA_API_BASE || 'https://qpbpbpiegm.us-east-1.awsapprunner.com';

export interface EdnaState {
  taken: boolean;
  coreName?: string;      // "Architect" / "Alchemist" / "Mixed (…-leaning)" / "Mixed"
  core?: 'architect' | 'alchemist' | 'mixed';
  dominantLoop?: string;  // e.g. "Logic → Feeling → Logic"
  alternateLoop?: string; // the under-stress loop
  assessedAt?: string;    // ISO date
  purchased: boolean;     // detailed report unlocked
}

function unwrapLayer7(raw: unknown): any {
  let text = raw;
  for (let i = 0; i < 3; i++) {
    if (text && typeof text === 'object') return text;
    if (typeof text !== 'string') return null;
    try { text = JSON.parse(text); } catch { return null; }
  }
  return typeof text === 'object' ? text : null;
}

const LOOPS: Record<string, [string, string]> = {
  architect: ['Logic → Feeling → Logic', 'Feeling → Logic → Feeling'],
  alchemist: ['Feeling → Logic → Feeling', 'Logic → Feeling → Logic'],
};

export async function fetchEdnaState(): Promise<EdnaState> {
  const none: EdnaState = { taken: false, purchased: false };
  try {
    const { session } = await authHelpers.getSession();
    if (!session) return none;
    const r = await fetch(
      `${EDNA_API_BASE}/api/v1/quiz/results/${encodeURIComponent(session.user.id.toUpperCase())}`,
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    );
    if (!r.ok) return none;
    const j = await r.json();
    const d = j && (j.results || j.data || j);
    if (!d) return none;
    const purchased = !!(d.fullResultPurchased || d.full_result_purchased);
    const env = unwrapLayer7(d.layer7Result || d.layer7_result);
    if (!env || !env.ednaV2 || !env.ednaV2.result) return { ...none, purchased };
    const res = env.ednaV2.result;
    const core: 'architect' | 'alchemist' | 'mixed' = res.p1?.core || 'mixed';
    const lean: string = res.p1?.lean || 'none';
    const loops = LOOPS[core] || (lean !== 'none' ? LOOPS[lean] : undefined);
    return {
      taken: true,
      coreName: res.p1?.result || core,
      core,
      dominantLoop: loops?.[0],
      alternateLoop: loops?.[1],
      assessedAt: env.ednaV2.savedAt,
      purchased,
    };
  } catch {
    return none;
  }
}

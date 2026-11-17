/**
 * Interactive workbooks API (18 Nov 2026) — the same shared-backend endpoints the iOS app
 * uses (/api/user/workbooks), so a member sees identical workbooks and answers on both
 * platforms. Requests carry the Cognito ID token AND the x-user-id header the iOS app also
 * sends (the backend's legacy mode reads the header; verify mode uses the token).
 *
 * Answer values are STRINGS, in the iOS app's own formats — checkboxes as a comma-separated
 * sorted list (InteractiveWorkbookView.encodeCheckboxValues) — so the two platforms read
 * each other's answers byte for byte.
 */
import { authHelpers } from './auth/cognito';
import { EDNA_API_BASE } from './edna';

export interface WorkbookListItem {
  id: string;
  name: string;
  title: string;
  typeId: string;
  workbook?: number;
  subtype?: string | null;
  hasInstance: boolean;
  lastSavedAt: string | null;
  isCompleted: boolean;
  lockedReason?: string;
}

export interface WorkbookList {
  workbooks: WorkbookListItem[];
  lockedWorkbooks: WorkbookListItem[];
  ednaV2: boolean;
  purchased: boolean;
}

export interface WorkbookInstancePayload {
  instance: { id: string; workbookId: string; isCompleted: boolean; lastSavedAt: string | null };
  workbook: { id: string; name: string; title: string; structure: any };
  answers: Record<string, string>;
}

async function wbFetch(path: string, init?: RequestInit): Promise<Response> {
  const { session } = await authHelpers.getSession();
  if (!session) throw new Error('signed-out');
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.access_token}`,
    'x-user-id': session.user.id.toUpperCase(), // the record convention the iOS app uses
    ...(init && init.body ? { 'Content-Type': 'application/json' } : {}),
  };
  return fetch(`${EDNA_API_BASE}${path}`, { ...init, headers: { ...headers, ...(init?.headers as any) } });
}

export async function fetchWorkbooks(): Promise<WorkbookList> {
  const r = await wbFetch('/api/user/workbooks');
  if (!r.ok) throw new Error(`workbooks ${r.status}`);
  const j = await r.json();
  return {
    workbooks: j.workbooks || [],
    lockedWorkbooks: j.lockedWorkbooks || [],
    ednaV2: !!(j.user && j.user.ednaV2),
    purchased: !!(j.user && j.user.purchased),
  };
}

export async function fetchInstance(workbookId: string): Promise<WorkbookInstancePayload> {
  const r = await wbFetch(`/api/user/workbooks/${encodeURIComponent(workbookId)}/instance`);
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `instance ${r.status}`);
  }
  const j = await r.json();
  return { instance: j.instance, workbook: j.workbook, answers: j.answers || {} };
}

export async function saveAnswer(instanceId: string, fieldKey: string, value: string): Promise<boolean> {
  const r = await wbFetch(`/api/user/workbooks/instances/${encodeURIComponent(instanceId)}/answers`, {
    method: 'POST',
    body: JSON.stringify({ fieldKey, value }),
  });
  return r.ok;
}

export async function completeWorkbook(instanceId: string): Promise<boolean> {
  const r = await wbFetch(`/api/user/workbooks/instances/${encodeURIComponent(instanceId)}/complete`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  return r.ok;
}

/* checkbox value format shared with iOS */
export const parseCheckboxValues = (v: string): string[] =>
  !v ? [] : v.split(',').map((s) => s.trim()).filter(Boolean);
export const encodeCheckboxValues = (vals: string[]): string => [...vals].sort().join(',');

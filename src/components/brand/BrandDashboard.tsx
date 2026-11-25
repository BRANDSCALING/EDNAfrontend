/**
 * BrandDashboard — the signed-in overview per BS-BRAND-001 and Mockup 02 (App Dashboard),
 * Phase 5 redesign, 17 Nov 2026.
 *
 * The E-DNA card is state-aware, mirroring the iOS dashboard: before the assessment it offers
 * "Take the free E-DNA assessment"; after it, the core type, decision loops and "View your
 * E-DNA report" — read from the SAME backend record the iOS app and /edna write (utils/edna.ts).
 * The sidebar routes into the existing member views (profile, workbooks, AI mentor, recordings).
 */
import { useEffect, useRef, useState } from 'react';
import { fetchEdnaState, type EdnaState } from '../../utils/edna';
import { authHelpers } from '../../utils/auth/cognito';
import { BrandWorkbooks } from './BrandWorkbooks';
import { AIMentorHub } from '../AIMentorHub';
import { ZoomRecordings } from '../ZoomRecordings';
// The old Courses/pricing page is retired (Fariza, 18 Nov 2026: "the old pricing is
// redundant… it's all new"); membership lives on the homepage until her tier pages land.

/* One dashboard (Fariza, #edna-app huddle 24 Nov 2026): Decision Intelligence sits under
   Overview with its six tabs. Each tab is a screen of the DI app at /app, drawn inside this
   dashboard in an iframe (?embed=1 hides the app's own sidebar), the same way the E-DNA
   report is embedded — a repositioning, not a rebuild. */
export type DiView = 'di-make' | 'di-log' | 'di-rooms' | 'di-reports' | 'di-workbooks' | 'di-edna' | 'di-scaling' | 'di-settings';
export const DI_VIEWS: DiView[] = ['di-make', 'di-log', 'di-rooms', 'di-reports', 'di-workbooks', 'di-edna', 'di-scaling', 'di-settings'];
const DI_TABS: [DiView, string][] = [
  ['di-make', 'Make a decision'], ['di-log', 'Decision log'], ['di-rooms', 'Decision rooms'],
  ['di-reports', 'My reports'], ['di-workbooks', 'My workbooks'], ['di-edna', 'My E-DNA'],
];

export type MemberView = 'overview' | 'profile' | 'plan' | 'workbooks' | 'chat' | 'zoom-recordings' | DiView;

interface BrandDashboardProps {
  userName: string;
  /** Which member view fills the main area; the sidebar highlights it. */
  view?: MemberView;
  onOpenMemberView: (view: MemberView | 'profile') => void;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function BrandDashboard({ userName, view = 'overview', onOpenMemberView, onViewChange, onLogout }: BrandDashboardProps) {
  const [edna, setEdna] = useState<EdnaState | null>(null);
  /* phones: the sidebar is a top bar with a hamburger that slides the menu down
     (member feedback, 20 Nov 2026 — the scrollable tab strip read badly) */
  const [navOpen, setNavOpen] = useState(false);
  const go = (v: MemberView) => { setNavOpen(false); onOpenMemberView(v); };
  const [diOpen, setDiOpen] = useState(true);
  /* Home (25 Nov, Munawar): the dashboard's first tab is the approved app design's Home
     screen, drawn by the same embedded app as the DI tabs, so it shares their iframe */
  const isDi = (DI_VIEWS as string[]).includes(view) || view === 'overview';
  const screenOf = (v: string) => (v === 'overview' ? 'home' : v.slice(3));
  /* the E-DNA reports open from DI · My reports (the old "My E-DNA profile" tab is hidden,
     Munawar 24 Nov), so the report view counts as part of My reports */
  const isReport = view === 'profile' || view === 'plan';
  /* the report page's hash: '' basic, '#detailed', '#detailed-N' (a part), '#plan' */
  const [reportKind, setReportKind] = useState<string>('');

  /* the DI iframe loads once per visit to the DI section; switching tabs posts a message
     so the app changes screen without reloading */
  const diRef = useRef<HTMLIFrameElement>(null);
  const diSrc = useRef<string | null>(null);
  const diLoaded = useRef(false);
  const viewRef = useRef(view);
  viewRef.current = view;
  if (isDi && !diSrc.current) {
    let room: string | null = null;
    try { room = sessionStorage.getItem('bs_di_room'); } catch { /* storage blocked */ }
    diSrc.current = '/app/index.html?embed=1&screen=' + screenOf(view) + (room ? '&room=' + encodeURIComponent(room) : '');
    diLoaded.current = false;
  }
  /* the app stays loaded (hidden) while a report or another page is open, so coming back
     shows it at once instead of reloading it (25 Nov: the reload flashed a blank page) */
  useEffect(() => {
    if (!isDi) return;
    try { sessionStorage.removeItem('bs_di_room'); } catch { /* storage blocked */ }
    if (diLoaded.current && diRef.current?.contentWindow) {
      diRef.current.contentWindow.postMessage({ bsShow: screenOf(view) }, window.location.origin);
    }
  }, [view, isDi]);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || !e.data) return;
      if (e.data.bsGo === 'overview') { onOpenMemberView('overview'); return; }
      if (e.data.bsGo === 'profile') {
        const h = typeof e.data.hash === 'string' && /^(#detailed(-[1-7])?|#plan)?$/.test(e.data.hash)
          ? e.data.hash : (e.data.report === 'detailed' ? '#detailed' : '');
        setReportKind(h);
        onOpenMemberView('profile');
        return;
      }
      if (e.data.bsScreen === 'home') { if (viewRef.current !== 'overview') onOpenMemberView('overview'); return; }
      const next = e.data.bsScreen ? ('di-' + e.data.bsScreen) as DiView : null;
      if (next && (DI_VIEWS as string[]).includes(next) && next !== viewRef.current) onOpenMemberView(next);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [onOpenMemberView]);

  /* Settings · Change email (25 Nov): the embedded app (same origin) checks the password and
     refreshes the token through these, since the Cognito library lives in this bundle */
  useEffect(() => {
    (window as any).bsAuth = {
      verifyPassword: async (pw: string) => {
        const { session } = await authHelpers.getSession();
        return session ? authHelpers.verifyPassword(session.user.email, pw) : false;
      },
      refreshIdToken: () => authHelpers.refreshIdToken(),
    };
    return () => { delete (window as any).bsAuth; };
  }, []);
  useEffect(() => {
    let alive = true;
    fetchEdnaState().then((s) => { if (alive) setEdna(s); });
    return () => { alive = false; };
  }, []);

  const openAssessment = () => { window.location.href = '/edna/index.html'; };

  return (
    <div className="bs-dash">
      <aside className={'bs-side' + (navOpen ? ' nav-open' : '')}>
        <div className="bs-side-top">
          <img src="/edna/img/logo.png" alt="Brandscaling" className="bs-side-logo" />
          <button
            type="button"
            className="bs-nav-burger"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
          >
            {navOpen ? '✕' : '☰'}
          </button>
        </div>
        <nav className="bs-side-menu">
          <button className={'bs-home' + (view === 'overview' ? ' on' : '')} onClick={() => go('overview')}>
            <svg className="bs-home-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></svg>
            <span>Home</span>
          </button>
          <button
            className={'bs-group' + (isDi && !diOpen ? ' on' : '')}
            aria-expanded={diOpen}
            onClick={() => setDiOpen((o) => !o)}
          >
            ◑ Decision Intelligence <span className="bs-chev" aria-hidden="true">{diOpen ? '▾' : '▸'}</span>
          </button>
          {diOpen && DI_TABS.map(([v, label]) => (
            <button key={v} className={'bs-sub' + (view === v || (v === 'di-reports' && isReport) ? ' on' : '')} onClick={() => go(v)}>{label}</button>
          ))}
          {/* Infinite Scaling, under Decision Intelligence as in Fariza's approved app design; it
              opens the app's approved placeholder page (screen 14) */}
          <button className={'bs-soon' + (view === 'di-scaling' ? ' on' : '')} onClick={() => go('di-scaling')}>
            <svg className="bs-soon-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20h16M6 16h12M8 12h8M10 8h4" /></svg>
            <span>Infinite Scaling</span>
            <span className="bs-soon-chip">Soon</span>
          </button>
          {/* "My E-DNA profile" and "Workbooks" are hidden (Munawar, 24 Nov): the reports open from
              DI · My reports and the workbooks are DI · My workbooks */}
          {/* AI mentors: Coming soon, matching the Overview card (24 Nov) */}
          <button className="bs-soon bs-soon-off" disabled aria-disabled="true">
            <span>💬 AI mentors</span>
            <span className="bs-soon-chip">Soon</span>
          </button>
          {/* Recordings are Elite-only and no Elite members exist yet (Fariza, 24 Nov 2026);
              hidden until the Elite tier is live, when this gates on the member's tier. */}
          {false && (
            <button className={view === 'zoom-recordings' ? 'on' : ''} onClick={() => go('zoom-recordings')}>▶ Recordings</button>
          )}
          {/* Settings: the approved app design's nine panels, real data (25 Nov) */}
          <button className={'bs-home' + (view === 'di-settings' ? ' on' : '')} onClick={() => go('di-settings')}>
            <svg className="bs-home-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
            <span>Settings</span>
          </button>
          <button onClick={onLogout}>↩ Log out</button>
        </nav>
        <div className="bs-side-foot">Decision Intelligence &amp; Infinite Scaling Mastery</div>
      </aside>

      {view === 'profile' && (
        <main className="bs-main">
          <button type="button" className="bs-backlink" onClick={() => go('di-reports')}>‹ My reports</button>
          {/* the approved /edna report, embedded so the member stays in the dashboard
              (Munawar, 18 Nov 2026); ?embed=1 hides the page's own header chrome.
              #detailed opens the Advanced Report (from DI · My reports, 24 Nov) */}
          <iframe
            key={reportKind}
            src={'/edna/index.html?embed=1' + reportKind}
            className="bs-edna-frame bs-edna-frame-back"
            title="Your E-DNA report"
          />
        </main>
      )}

      {diSrc.current && (
        <main className="bs-main" style={isDi ? undefined : { display: 'none' }}>
          <iframe
            ref={diRef}
            src={diSrc.current}
            className="bs-edna-frame"
            title="Decision Intelligence"
            allow="clipboard-write"
            onLoad={() => {
              diLoaded.current = true;
              /* a tab clicked while the app was still loading */
              diRef.current?.contentWindow?.postMessage({ bsShow: screenOf(viewRef.current) }, window.location.origin);
            }}
          />
        </main>
      )}

      {view === 'plan' && (
        <main className="bs-main">
          {/* the E-DNA plan ('adapt' screen), embedded like the profile (Munawar, 19 Nov) */}
          <iframe src="/edna/index.html?embed=1#plan" className="bs-edna-frame" title="Your E-DNA plan" />
        </main>
      )}

      {view === 'workbooks' && (
        <main className="bs-main">
          <div className="bs-card">
            {edna === null && <p className="bs-empty-copy">Loading…</p>}
            {edna !== null && !edna.taken && (
              <>
                <p className="bs-empty-copy">
                  Your workbooks are built from your E-DNA. Take the free assessment first, and they
                  unlock here.
                </p>
                <button className="bs-btn bs-btn-energy" onClick={openAssessment}>Take the free E-DNA assessment</button>
              </>
            )}
            {edna !== null && edna.taken && (
              <BrandWorkbooks onOpenMentors={() => onOpenMemberView('chat')} onOpenPlan={() => onOpenMemberView('plan')} />
            )}
          </div>
        </main>
      )}

      {view === 'chat' && (
        <main className="bs-main">
          <div className="bs-card">
            <AIMentorHub onViewChange={onViewChange} isInDashboard={true} />
          </div>
        </main>
      )}

      {view === 'zoom-recordings' && (
        <main className="bs-main">
          <div className="bs-card"><ZoomRecordings /></div>
        </main>
      )}

    </div>
  );
}

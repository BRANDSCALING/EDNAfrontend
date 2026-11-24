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
import { BrandWorkbooks } from './BrandWorkbooks';
import { AIMentorHub } from '../AIMentorHub';
import { ZoomRecordings } from '../ZoomRecordings';
// The old Courses/pricing page is retired (Fariza, 18 Nov 2026: "the old pricing is
// redundant… it's all new"); membership lives on the homepage until her tier pages land.

/* One dashboard (Fariza, #edna-app huddle 24 Nov 2026): Decision Intelligence sits under
   Overview with its six tabs. Each tab is a screen of the DI app at /app, drawn inside this
   dashboard in an iframe (?embed=1 hides the app's own sidebar), the same way the E-DNA
   report is embedded — a repositioning, not a rebuild. */
export type DiView = 'di-make' | 'di-log' | 'di-rooms' | 'di-reports' | 'di-workbooks' | 'di-edna';
export const DI_VIEWS: DiView[] = ['di-make', 'di-log', 'di-rooms', 'di-reports', 'di-workbooks', 'di-edna'];
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
  const isDi = (DI_VIEWS as string[]).includes(view);
  /* the E-DNA reports open from DI · My reports (the old "My E-DNA profile" tab is hidden,
     Munawar 24 Nov), so the report view counts as part of My reports */
  const isReport = view === 'profile' || view === 'plan';
  const [reportKind, setReportKind] = useState<'basic' | 'detailed'>('basic');

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
    diSrc.current = '/app/index.html?embed=1&screen=' + view.slice(3) + (room ? '&room=' + encodeURIComponent(room) : '');
    diLoaded.current = false;
  }
  if (!isDi) diSrc.current = null;
  useEffect(() => {
    if (!isDi) return;
    try { sessionStorage.removeItem('bs_di_room'); } catch { /* storage blocked */ }
    if (diLoaded.current && diRef.current?.contentWindow) {
      diRef.current.contentWindow.postMessage({ bsShow: view.slice(3) }, window.location.origin);
    }
  }, [view, isDi]);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || !e.data) return;
      if (e.data.bsGo === 'overview') { onOpenMemberView('overview'); return; }
      if (e.data.bsGo === 'profile') {
        setReportKind(e.data.report === 'detailed' ? 'detailed' : 'basic');
        onOpenMemberView('profile');
        return;
      }
      const next = e.data.bsScreen ? ('di-' + e.data.bsScreen) as DiView : null;
      if (next && (DI_VIEWS as string[]).includes(next) && next !== viewRef.current) onOpenMemberView(next);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [onOpenMemberView]);

  useEffect(() => {
    let alive = true;
    fetchEdnaState().then((s) => { if (alive) setEdna(s); });
    return () => { alive = false; };
  }, []);

  const initials = userName.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'M';
  const openAssessment = () => { window.location.href = '/edna/index.html'; };
  const assessedOn = edna?.assessedAt
    ? new Date(edna.assessedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;
  /* The primary mentor follows the Dominant loop OR the leaning (02-report.js part 1):
     Alchemist or Alchemist-leaning → AI Alchemist; pure Mixed has no primary — both mentors. */
  const mentorSide =
    edna?.core === 'alchemist' || edna?.core === 'architect' ? edna.core
    : edna?.lean === 'alchemist' || edna?.lean === 'architect' ? edna.lean
    : null;
  const primaryMentor = mentorSide === 'alchemist' ? 'AI Alchemist' : 'AI Architect';
  const complementaryMentor = mentorSide === 'alchemist' ? 'AI Architect' : 'AI Alchemist';

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
          <button className={view === 'overview' ? 'on' : ''} onClick={() => go('overview')}>▦ Overview</button>
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
          {/* "My E-DNA profile" and "Workbooks" are hidden (Munawar, 24 Nov): the reports open from
              DI · My reports and the workbooks are DI · My workbooks */}
          <button className={view === 'chat' ? 'on' : ''} onClick={() => go('chat')}>💬 AI mentors</button>
          {/* Recordings are Elite-only and no Elite members exist yet (Fariza, 24 Nov 2026);
              hidden until the Elite tier is live, when this gates on the member's tier. */}
          {false && (
            <button className={view === 'zoom-recordings' ? 'on' : ''} onClick={() => go('zoom-recordings')}>▶ Recordings</button>
          )}
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
            src={'/edna/index.html?embed=1' + (reportKind === 'detailed' ? '#detailed' : '')}
            className="bs-edna-frame bs-edna-frame-back"
            title="Your E-DNA report"
          />
        </main>
      )}

      {isDi && diSrc.current && (
        <main className="bs-main">
          <iframe
            ref={diRef}
            src={diSrc.current}
            className="bs-edna-frame"
            title="Decision Intelligence"
            allow="clipboard-write"
            onLoad={() => {
              diLoaded.current = true;
              /* a tab clicked while the app was still loading */
              diRef.current?.contentWindow?.postMessage({ bsShow: viewRef.current.slice(3) }, window.location.origin);
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

      {view === 'overview' && (
      <main className="bs-main">
        <header className="bs-dash-head">
          <div>
            <h1>Welcome back, {userName}</h1>
            <p>Before you can work on any business, you need to understand yourself and how you and others make decisions.</p>
          </div>
          <span className="bs-avatar" aria-hidden="true">{initials}</span>
        </header>

        <div className="bs-cards">
          <section className="bs-card">
            <div className="bs-card-head">
              <h2>Your E-DNA profile</h2>
              {assessedOn && <span className="bs-when">Assessed {assessedOn}</span>}
            </div>

            {edna === null && <p className="bs-empty-copy">Checking your assessment…</p>}

            {edna !== null && !edna.taken && (
              <>
                <p className="bs-empty-copy">
                  You haven't taken the E-DNA assessment yet. It's free, takes about 30 minutes, and
                  shows you how you naturally make decisions.
                </p>
                <button className="bs-btn bs-btn-energy" onClick={openAssessment}>
                  Take the free E-DNA assessment
                </button>
              </>
            )}

            {edna !== null && edna.taken && (
              <>
                <div className="bs-core-row">
                  <span className="bs-core-badge" aria-hidden="true">◍</span>
                  <div>
                    <p className="bs-core-kicker">Core type</p>
                    <p className="bs-core-name">{edna.coreName}</p>
                  </div>
                </div>
                {edna.dominantLoop && (
                  <div className="bs-loop bs-loop-main">
                    <small>Dominant Decision Loop</small>
                    {edna.dominantLoop}
                  </div>
                )}
                {edna.alternateLoop && (
                  <div className="bs-loop bs-loop-alt">
                    <small>Alternate Decision Loop (under stress)</small>
                    {edna.alternateLoop}
                  </div>
                )}
                <button className="bs-btn bs-btn-action" onClick={() => { setReportKind('basic'); onOpenMemberView('profile'); }} style={{ marginTop: 6 }}>
                  View your E-DNA report
                </button>
              </>
            )}
          </section>

          <section className="bs-card">
            <div className="bs-card-head">
              <h2>Your AI mentors</h2>
              {edna?.taken && (
                <span className="bs-when">
                  {mentorSide ? 'Primary mentor matches your Dominant Decision Loop'
                    : 'AI mentors: AI Architect and AI Alchemist'}
                </span>
              )}
            </div>
            {edna?.taken && !mentorSide ? (
              /* pure Mixed: no Dominant loop yet, so no Primary — both mentors, as the report says */
              <>
                <div className="bs-loop bs-loop-alt">AI Architect</div>
                <div className="bs-loop bs-loop-alt">AI Alchemist</div>
              </>
            ) : edna?.taken ? (
              <>
                <div className="bs-loop bs-loop-main">
                  <small>Primary</small>
                  {primaryMentor}
                </div>
                <div className="bs-loop bs-loop-alt">
                  <small>Complementary</small>
                  {complementaryMentor}
                </div>
              </>
            ) : (
              <p className="bs-empty-copy">
                Two mentors, two minds: the AI Architect thinks in logic and systems, the AI
                Alchemist in feeling and story. Your primary mentor is matched from your E-DNA.
              </p>
            )}
            <button className="bs-btn bs-btn-outline" onClick={() => onOpenMemberView('chat')} style={{ marginTop: 6 }}>
              Ask your mentors
            </button>
          </section>

          <section className="bs-card">
            <div className="bs-card-head"><h2>Workbooks</h2></div>
            <p className="bs-empty-copy">
              Your workbooks are built from your E-DNA: what to adapt, and what the app provides.
              {!edna?.taken && ' They unlock once you have taken the assessment.'}
            </p>
            <button className="bs-btn bs-btn-outline" onClick={() => onOpenMemberView('di-workbooks')}>
              Open your workbooks
            </button>
          </section>

          <section className="bs-card">
            <div className="bs-card-head"><h2>Recordings</h2></div>
            <p className="bs-empty-copy">
              Deal Clinic and Mastermind Day recordings, synced as new sessions are published.
            </p>
            <button className="bs-btn bs-btn-outline" onClick={() => onOpenMemberView('zoom-recordings')}>
              Watch recordings
            </button>
          </section>
        </div>
      </main>
      )}
    </div>
  );
}

/**
 * BrandDashboard — the signed-in overview per BS-BRAND-001 and Mockup 02 (App Dashboard),
 * Phase 5 redesign, 17 Nov 2026.
 *
 * The E-DNA card is state-aware, mirroring the iOS dashboard: before the assessment it offers
 * "Take the free E-DNA assessment"; after it, the core type, decision loops and "View your
 * E-DNA report" — read from the SAME backend record the iOS app and /edna write (utils/edna.ts).
 * The sidebar routes into the existing member views (profile, workbooks, AI mentor, recordings).
 */
import { useEffect, useState } from 'react';
import { fetchEdnaState, type EdnaState } from '../../utils/edna';
import { BrandWorkbooks } from './BrandWorkbooks';
import { AIMentorHub } from '../AIMentorHub';
import { ZoomRecordings } from '../ZoomRecordings';
import { Courses } from '../Courses';

export type MemberView = 'overview' | 'workbooks' | 'chat' | 'zoom-recordings' | 'courses';

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
  const primaryMentor = edna?.core === 'alchemist' ? 'AI Alchemist' : 'AI Architect';
  const complementaryMentor = edna?.core === 'alchemist' ? 'AI Architect' : 'AI Alchemist';

  return (
    <div className="bs-dash">
      <aside className="bs-side">
        <img src="/edna/img/logo.png" alt="Brandscaling" className="bs-side-logo" />
        <button className={view === 'overview' ? 'on' : ''} onClick={() => onOpenMemberView('overview')}>▦ Overview</button>
        <button onClick={openAssessment}>◍ My E-DNA profile</button>
        <button className={view === 'chat' ? 'on' : ''} onClick={() => onOpenMemberView('chat')}>💬 AI mentors</button>
        <button className={view === 'workbooks' ? 'on' : ''} onClick={() => onOpenMemberView('workbooks')}>📓 Workbooks</button>
        <button className={view === 'zoom-recordings' ? 'on' : ''} onClick={() => onOpenMemberView('zoom-recordings')}>▶ Recordings</button>
        <button className={view === 'courses' ? 'on' : ''} onClick={() => onOpenMemberView('courses')}>🎓 Courses</button>
        <button onClick={onLogout}>↩ Log out</button>
        <div className="bs-side-foot">Decision Intelligence &amp; Infinite Scaling Mastery</div>
      </aside>

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
              <BrandWorkbooks onOpenMentors={() => onOpenMemberView('chat')} />
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

      {view === 'courses' && (
        <main className="bs-main">
          <div className="bs-card"><Courses onViewChange={onViewChange} isAuthenticated={true} /></div>
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
                  You haven't taken the E-DNA assessment yet. It's free, takes about 25 minutes, and
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
                <button className="bs-btn bs-btn-action" onClick={openAssessment} style={{ marginTop: 6 }}>
                  View your E-DNA report
                </button>
              </>
            )}
          </section>

          <section className="bs-card">
            <div className="bs-card-head">
              <h2>Your AI mentors</h2>
              {edna?.taken && <span className="bs-when">Primary mentor matches your Dominant Decision Loop</span>}
            </div>
            {edna?.taken ? (
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
            <button className="bs-btn bs-btn-outline" onClick={() => onOpenMemberView('workbooks')}>
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

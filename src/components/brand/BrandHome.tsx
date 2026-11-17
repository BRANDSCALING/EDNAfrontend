/**
 * BrandHome — the public landing page per BS-BRAND-001 and Mockup 01 (Website Hero),
 * Phase 5 redesign, 17 Nov 2026. Replaces the old Navigation + Home pair when signed out.
 *
 * Nav labels follow the mockup. "Membership" routes to Courses until the GHL tier landing
 * pages exist (flagged to Fariza); the other labels map to the closest existing views.
 */

import { BrandNav } from './BrandNav';

interface BrandHomeProps {
  onViewChange: (view: string) => void;
  onSignIn: () => void;
}

const TOWER: Array<[string, string]> = [
  // label, background — the six Infinite Scaling Tower layers, top to bottom (BS-BRAND-001)
  ['Ecosystem', 'linear-gradient(135deg, #FFB31A, #F6A11B)'],
  ['Platform Thinking', 'linear-gradient(135deg, #F6782F, #EF6023)'],
  ['Multiple Exits', 'linear-gradient(135deg, #EF4B4B, #E03A44)'],
  ['Asset Builder', 'linear-gradient(135deg, #D62E7E, #C72170)'],
  ['AI Infrastructure', 'linear-gradient(135deg, #8E2A8B, #841477)'],
  ['Profit Maximisation Blueprint', 'linear-gradient(135deg, #42047D, #2E0358)'],
];

export function BrandHome({ onViewChange, onSignIn }: BrandHomeProps) {
  const takeAssessment = () => onViewChange('quiz');
  return (
    <div className="bs-page" style={{ background: 'linear-gradient(180deg, #FAF8FC 0%, #F6F3F9 100%)', paddingBottom: 64 }}>
      <BrandNav onViewChange={onViewChange} onSignIn={onSignIn} />

      <div className="bs-hero-wrap">
        <div>
          <p className="bs-eyebrow">Decision Intelligence &amp; Infinite Scaling Mastery</p>
          <h1 className="bs-hero-title">Before you work on your business, understand how you decide.</h1>
          <p className="bs-hero-copy">
            The world's first AI-powered Brandscaling Decision Intelligence and business operating
            system. Discover your E-DNA, work with two AI mentors, and build through the six layers
            of the Infinite Scaling Tower.
          </p>
          <div className="bs-hero-ctas">
            <button className="bs-btn bs-btn-energy" onClick={takeAssessment}>Take the free E-DNA assessment</button>
            <button className="bs-btn bs-btn-outline" onClick={() => onViewChange('about')}>Explore the operating system</button>
          </div>
          <div className="bs-chips">
            <span className="bs-chip"><span className="bs-chip-dot" style={{ background: '#42047D' }}>◍</span>Free E-DNA assessment</span>
            <span className="bs-chip"><span className="bs-chip-dot" style={{ background: '#C72170' }}>❖</span>AI Alchemist and AI Architect</span>
            <span className="bs-chip"><span className="bs-chip-dot" style={{ background: '#F6782F' }}>≡</span>Six-layer Infinite Scaling Tower</span>
          </div>
        </div>

        <div className="bs-hero-card">
          <img src="/edna/img/logo.png" alt="" className="bs-hero-logo" aria-hidden="true" />
          <div className="bs-tower" role="img" aria-label="The six layers of the Infinite Scaling Tower">
            {TOWER.map(([label, bg], i) => (
              <div key={label} className="bs-tower-step" style={{ background: bg, width: `${46 + i * 9}%` }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Courses — restyled 17 Nov 2026 to the BS-BRAND-001 design language (bs-* classes).
 * Tier names, prices, bullet lists and the two external course links are product facts and are
 * kept exactly as they were; only presentation changed. "Discover Your DNA" now opens the new
 * /edna assessment (the old in-app quiz view is retired).
 */

import { CheckCircle, ArrowRight } from 'lucide-react';

interface CoursesProps {
  onViewChange: (view: string) => void;
  isAuthenticated: boolean;
}

interface Tier {
  name: string;
  price: string;
  tagline: string;
  bullets: string[];
  accent: 'plain' | 'action' | 'energy';
  badge?: string;
  cta: { label: string; onClick?: () => void; disabled?: boolean };
}

export function Courses({ onViewChange }: CoursesProps) {
  const openAssessment = () => { window.location.href = '/edna/index.html'; };

  const tiers: Tier[] = [
    {
      name: 'Entry',
      price: '£499',
      tagline: 'Perfect for idea-stage entrepreneurs',
      bullets: ['Idea-to-Launch Kit™', 'Smart Business Builder™', 'AI Mentor Access', '30-Day Launch Plan'],
      accent: 'plain',
      cta: {
        label: 'Get Started',
        onClick: () => window.open('https://launch-kit-uk-blueprint-sh.lovable.app/', '_blank'),
      },
    },
    {
      name: 'Expert',
      price: '£999',
      tagline: 'For growing businesses ready to scale',
      bullets: ['Everything in Entry', 'Magnetic Offer Builder™', 'The Energetic Edge™', 'Conversion Confidence Kit™'],
      accent: 'action',
      badge: 'Coming Soon',
      cta: { label: 'Coming Soon', disabled: true },
    },
    {
      name: 'Elite',
      price: '£20k',
      tagline: 'Complete scaling ecosystem + mastermind',
      bullets: ['Full Course Vault Access', 'Private Mastermind', '1:1 Strategy Sessions', 'Direct Mentor Access'],
      accent: 'energy',
      cta: {
        label: 'Apply Now',
        onClick: () => window.open('https://brandscalingschoolforentrepreneur.replit.app/', '_blank'),
      },
    },
  ];

  return (
    <div>
      <h1 className="bs-view-title">Choose your growth path</h1>
      <p className="bs-view-sub">
        From first idea to 8-figure scaling. All DNA-personalized. All step-by-step.
      </p>

      <div className="bs-tiers">
        {tiers.map((t) => (
          <div key={t.name} className={`bs-tier bs-tier-${t.accent}`}>
            {t.badge && <span className="bs-tier-badge">{t.badge}</span>}
            <h3>{t.name}</h3>
            <p className="bs-tier-price">{t.price}</p>
            <p className="bs-tier-tag">{t.tagline}</p>
            <ul className="bs-ticks">
              {t.bullets.map((b) => (
                <li key={b}>
                  <CheckCircle size={17} aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <button
              className={`bs-btn bs-btn-block ${
                t.cta.disabled ? 'bs-btn-disabled' : t.accent === 'energy' ? 'bs-btn-energy' : 'bs-btn-action'
              }`}
              onClick={t.cta.onClick}
              disabled={t.cta.disabled}
            >
              {t.cta.label}
            </button>
          </div>
        ))}
      </div>

      <div className="bs-journey">
        <h2>Begin Your Journey to 9-Figure Scale</h2>
        <p>
          Every billion-dollar business started with one entrepreneur discovering their true DNA and
          scaling accordingly. Your breakthrough moment starts now.
        </p>
        <div className="bs-journey-ctas">
          <button className="bs-btn bs-btn-on-dark" onClick={openAssessment}>
            Discover Your DNA <ArrowRight size={17} />
          </button>
          <button className="bs-btn bs-btn-ghost-dark" onClick={() => onViewChange('home')}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

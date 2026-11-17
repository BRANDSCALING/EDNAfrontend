/**
 * AI Mentor Hub — restyled 17 Nov 2026 to the BS-BRAND-001 design language (bs-* classes).
 * Copy and the two disabled "Coming Soon" buttons are unchanged product facts; only
 * presentation changed. Renders inside a .bs-card in BrandDashboard, so content only.
 */

import { CheckCircle, Target, Lightbulb } from 'lucide-react';

interface AIMentorHubProps {
  onViewChange?: (view: string) => void;
  isInDashboard?: boolean;
}

interface Mentor {
  title: string;
  traits: string;
  icon: typeof Target;
  energy: boolean;
  points: string[];
}

export function AIMentorHub(_props: AIMentorHubProps) {
  const mentors: Mentor[] = [
    {
      title: 'Collaboration Mastery',
      traits: 'Logical • Data • Strategic',
      icon: Target,
      energy: false,
      points: [
        'Systematises processes & structures',
        'Builds repeatable, scalable systems',
        'Prioritises data-driven decisions',
      ],
    },
    {
      title: 'Decision Intelligence',
      traits: 'Creative • Energetic • Experimental',
      icon: Lightbulb,
      energy: true,
      points: [
        'Thrives on ideation, creativity and innovation',
        'Trusts intuition and adaptability',
        'Crafts vision—often rally agreements',
      ],
    },
  ];

  return (
    <div>
      <h1 className="bs-view-title">Meet Your AI Business Advisors</h1>
      <p className="bs-view-sub">
        Choose the AI mentor that matches your entrepreneurial DNA. Start with the Architect for
        systems and structure, or the Alchemist for creative experimentation and rapid ideation.
      </p>

      <div className="bs-mentors">
        {mentors.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className={`bs-mentor ${m.energy ? 'bs-mentor-energy' : ''}`}>
              <div className="bs-mentor-head">
                <span className={`bs-wb-icon ${m.energy ? 'bs-wb-icon-energy' : ''}`} aria-hidden="true">
                  <Icon size={22} />
                </span>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.traits}</p>
                </div>
              </div>
              <ul className="bs-ticks">
                {m.points.map((p) => (
                  <li key={p}>
                    <CheckCircle size={17} aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <button className="bs-btn bs-btn-block bs-btn-disabled" disabled>
                Coming Soon
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

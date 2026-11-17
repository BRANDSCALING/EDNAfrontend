/**
 * About — restyled 17 Nov 2026 to the BS-BRAND-001 design language (bs-* classes).
 * Every word of the founders' bios and framework copy is kept verbatim (product facts);
 * only presentation changed. Rendered by App inside the public brand shell (BrandNav +
 * .bs-pub-main), so this outputs content only. The CTA routes to 'quiz', which App
 * redirects to the new /edna assessment.
 */

import { ArrowRight } from 'lucide-react';

interface AboutProps {
  onViewChange: (view: string) => void;
}

export function About({ onViewChange }: AboutProps) {
  return (
    <div>
      <div className="bs-about-intro">
        <h1 className="bs-view-title">Meet the Duo Behind the Brandscaling Method™</h1>
        <p className="bs-about-lede">Alchemist Meets Architect. Emotion Meets Execution.</p>
        <p className="bs-view-sub">
          Together, Fariza Javed and Hanif Khan built Brandscaling to further expand their own
          portfolio of investments and help entrepreneurs scale without distortion—by aligning
          structure with energy, profit with purpose, and frameworks with frequency.
        </p>
      </div>

      <section className="bs-panel bs-panel-energy">
        <h2>Fariza Javed — The Alchemist</h2>
        <p className="bs-panel-kicker">Warm. Magnetic. Empowering.</p>
        <p>
          Fariza brings ignition to everything she touches. With an instinctive gift for emotional
          clarity and high-frequency leadership, she helps clients unlock momentum by leaning into
          their inner brilliance. Her intuitive lens sees beyond surface problems, helping founders
          align with their purpose, attract with presence, and scale without abandoning who they are.
        </p>
        <p>
          At just 23, she launched her first business: Property People, a letting agency. She then
          ventured into building and investing across various industries. Her most recent company
          before retiring was a global beauty distribution business that scaled across the UK,
          Europe, South Korea, and the United States—supplying hundreds of SKUs from multiple brands
          to every major retailer, including Harrods, Sephora, Selfridges, Boots, Next, Beauty Bay,
          Look Fantastic, Cult Beauty, Feel Unique, Urban Outfitters—the list was endless—all whilst
          raising four children.
        </p>
        <p>
          As a mentor and strategist, Fariza helps founders unlock growth by removing internal
          resistance, simplifying brand messaging, and reconnecting to the parts of their business
          that still feel magnetic. She helps founders scale without silencing themselves—leading
          without leaking energy and finding their business's true voice and vision.
        </p>
      </section>

      <section className="bs-panel bs-panel-action">
        <h2>Hanif Khan — The Architect</h2>
        <p className="bs-panel-kicker">Strategic. Analytical. Systems-Driven.</p>
        <p>
          Hanif brings order to chaos. A former software architect turned scaling strategist, he
          specializes in designing frameworks that turn scattered ideas into scalable systems. He
          sees the invisible logic behind growth—mapping structure, automation, and team layers
          around a business that's ready to multiply.
        </p>
        <p>
          After entering property, Hanif co-founded Albright Estates, building a portfolio with
          automation at its core. He then launched the TYCOON mastermind alliance to help property
          entrepreneurs grow and scale. An angel investor who collaborates closely with multiple
          VCs, Hanif also patented the Loft Storage Stilt and built a multi-million-pound
          distribution business supplying UK hardware giants like B&amp;Q, Screwfix, and Travis Perkins.
        </p>
        <p>
          Hanif has an unrivaled ability to identify what's broken in a business—before the founder
          can even name it—and then builds what's needed to fix it. His frameworks have helped
          countless founders move from scattered to strategically empowered.
        </p>
      </section>

      <section className="bs-panel bs-panel-mixed">
        <h2>Together: The Founders of the Brandscaling Operating System</h2>
        <p className="bs-panel-strong">Fariza and Hanif built Brandscaling around a revolutionary insight:</p>
        <p className="bs-panel-quote">
          "Scaling doesn't fail because of the wrong strategy. It fails because the strategy doesn't
          match the person executing it."
        </p>
        <p>
          After semi-retiring during the COVID lockdown to focus on their newborn and travel the
          world, Fariza and Hanif shifted focus from their own ventures to mentoring others. What
          began as a way to increase their bandwidth evolved into a movement—helping founders and
          entrepreneurs move from stuck to scaling through their dual-mode method: The Architect
          &amp; The Alchemist.
        </p>
        <p>
          Today, they lead Brandscaling's high-ticket mastermind, live events, and embedded
          consulting—partnering with founders to scale without burnout, build ecosystems, and embed
          their genius into something that lasts.
        </p>
        <p className="bs-panel-strong">
          This is more than business strategy. More than an energetic infrastructure for scaling.
        </p>
        <p className="bs-panel-strong">This is Infinite Scaling.</p>
      </section>

      <div className="bs-about-intro">
        <h2 className="bs-view-title">Original Frameworks Created by Hanif &amp; Fariza</h2>
        <p className="bs-view-sub">
          Unlike typical business programs that recycle surface-level tactics, the Brandscaling
          system is entirely original—built from scratch, based on years of hands-on work with real
          founders scaling infinitely.
        </p>
      </div>

      <section className="bs-panel bs-panel-action">
        <h2>The Architect–Alchemist Model™</h2>
        <p>A proprietary lens for how entrepreneurs think, operate, and scale.</p>
        <p>
          Every founder is guided to discover their Entrepreneurial DNA—then learns through tailored
          frameworks built for that exact style.
        </p>
        <p className="bs-panel-strong">→ No more one-size-fits-all strategies.</p>
      </section>

      <section className="bs-panel bs-panel-energy">
        <h2>The Infinite Scaling Methodology™</h2>
        <p>A multi-layered pyramid showing how to scale in sequence:</p>
        <p className="bs-panel-strong">
          Profit Maximisation → Automate → Asset Builder → Multiple Exits → Platform → Ecosystem →
          Infinite Layer
        </p>
        <p>
          Each layer includes Architect and Alchemist approaches—so you grow using your strength and
          understand your blind spots.
        </p>
        <p className="bs-panel-strong">
          Most models teach "more." This teaches better sequencing, better wiring, and better scale.
        </p>
      </section>

      <section className="bs-panel bs-panel-mixed">
        <h2>The F.U.S.E. Framework™ for Founders</h2>
        <p className="bs-panel-strong">Partner-Led Scaling. Built for Embedding.</p>
        <p>
          You're not here to sell another service. You're here to become infrastructure inside
          someone else's business.
        </p>
        <p className="bs-panel-strong">What F.U.S.E. Stands For:</p>
        <p><strong>F —</strong> Find a Problem that truly matters to the business you want to collaborate with.</p>
        <p><strong>U —</strong> Unite it with your services—match your offer to their friction.</p>
        <p><strong>S —</strong> Solve it with adaptation—wrap your solution to fit their existing journey.</p>
        <p><strong>E —</strong> Extend into their system—keep building until your offer becomes essential.</p>
        <p>
          Each phase supports both: Architect (logic, systems, structure) and Alchemist (emotion,
          energy, resonance)
        </p>
        <p className="bs-panel-strong">F.U.S.E. isn't about adding offers. It's about embedding into ecosystems.</p>
      </section>

      <section className="bs-panel bs-panel-energy">
        <h2>The Profit Maximisation Blueprint™</h2>
        <p>
          More than making money—this is about building a machine that keeps it, compounds it, and
          protects your energy while doing it.
        </p>
        <p className="bs-panel-strong">What's Inside:</p>
        <p><strong>Sustainable Customer Creation Factory —</strong> Turn visibility into consistently activated, paying customers.</p>
        <p><strong>Fan Creation Factory —</strong> Build a loyal audience that buys, refers, and advocates—on autopilot.</p>
        <p><strong>Partner Creation Factory —</strong> Plug into power partnerships that multiply reach without multiplying work.</p>
        <p><strong>Painkiller Product Positioning —</strong> Design offers that solve urgent problems and become non-negotiable.</p>
        <p><strong>Recruitment Engine —</strong> Attract and install the right people in the right seats—without draining your time.</p>
        <p><strong>Sales Strategy Stack —</strong> Close more, with less friction—aligned to both your pricing model and your buyer psychology.</p>
        <p><strong>Power Play Protocol —</strong> Strip your business back to what actually drives profit—and turn that into a repeatable, dominant edge.</p>
        <p className="bs-panel-strong">Dual Perspective Integration:</p>
        <p><strong>Architect —</strong> Optimize systems, pricing, cost-to-delivery ratios, and operational profit structure.</p>
        <p><strong>Alchemist —</strong> Align profit with purpose, energy, time freedom, and personal bandwidth.</p>
        <p className="bs-panel-strong">
          Profit isn't just what's left over. In this blueprint, it becomes the fuel, filter, and
          foundation for everything that follows.
        </p>
      </section>

      <section className="bs-card bs-about-unique">
        <h2>What Makes These Frameworks Unique?</h2>
        <h3>Dual-Mode Learning</h3>
        <p>
          Every tool, course, and workbook is built in two styles—Architect (logic-first) and
          Alchemist (energy-first). No other platform in the market is designed this way.
        </p>
        <h3>Founder-Led, Field-Tested</h3>
        <p>
          These aren't theories—they've been applied in scaling real companies, tested in
          masterminds, and stress-tested by hundreds of founders.
        </p>
        <h3>Emotionally-Aware + Strategically-Precise</h3>
        <p>
          No fluffy mindset work. No rigid frameworks. Brandscaling meets you at your depth and
          builds upward from who you already are.
        </p>
      </section>

      <div className="bs-journey">
        <h2>Ready to Discover Your DNA?</h2>
        <p>
          Take the assessment and join thousands of entrepreneurs who've found their path to
          sustainable, scalable success.
        </p>
        <div className="bs-journey-ctas">
          <button className="bs-btn bs-btn-on-dark" onClick={() => onViewChange('quiz')}>
            Take Your DNA Assessment <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

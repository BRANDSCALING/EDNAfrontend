/**
 * Home Component
 * Replicated from Brandscaling reference design
 */

import { Button } from './ui/button';
import { Brain, CheckCircle, ArrowRight, Target, Lightbulb, Users, TrendingUp } from 'lucide-react';
import { Footer } from './Footer';
import timelineBgVideo from '../assets/timeline-bg.mp4';

interface HomeProps {
  onViewChange: (view: string) => void;
}

export function Home({ onViewChange }: HomeProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding-bs bg-white relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 -translate-y-16 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src={timelineBgVideo} type="video/mp4" />
          </video>
        </div>

        <div className="container-bs-desktop relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="typo-h1-bs mb-6">
              The World's 1st AI-Powered<br />Decision Intelligence And <br />
              <span className="text-black">Collaboration Mastery Ecosystem</span>
            </h1>
            <p className="typo-body-bs text-gray-700 max-w-2xl mx-auto mb-8">
              Discover your Entrepreneurial DNA, build decision intelligence with education and AI mentorship, then scale inside the Brandscaling Mastermind with human support and collaboration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => onViewChange('quiz')}
                className="cta-gradient-bs px-8 flex items-center justify-center gap-2"
              >
                <span>Discover Your E-DNA</span>
              </button>
              
            </div>
            <p className="typo-caption-bs text-gray-500">
              <span className="font-semibold">"Purpose → Profit → Purpose. Every entrepreneur is either an Architect or an Alchemist. Which are you?"</span>
              <br />
              <span className="text-gradient-arch-scale font-medium">— The Architect & The Alchemist</span>
            </p>
          </div>
        </div>
      </section>

      {/* Meet Your AI Business Advisors */}
      <section className="section-padding-bs bg-gray-50">
        <div className="container-bs-desktop">
          <div className="text-center mb-[var(--bs-spacing-section-heading)]">
            <h2 className="typo-h2-bs mb-4">Meet Your AI Business Advisors</h2>
            <p className="typo-body-bs text-gray-600 max-w-3xl mx-auto">
              Two AI mentors trained on the Architect–Alchemist model. They read your E-DNA profile, learn how you decide, and help you stabilise your decision loop in real time – so you don’t have to do it alone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The AI Architect */}
            <div className="program-flow-card border-l-4 border-purple-600">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="typo-h3-bs mb-1">Decision Intelligence</h3>
                  <p className="typo-caption-bs text-gray-600">Logical • Structual • Data-Grounded</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Systematises processes & structures</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Builds repeatable, scalable systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Prioritises data-driven decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Best for clarifying decisions, building systems, and checking assumptions against reality.</span>
                </li>
              </ul>
              <button
                onClick={() => onViewChange('chat')}
                className="mt-6 w-full py-3 border-2 border-purple-600 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium text-center"
              >
                Meet the Architect
              </button>
            </div>

            {/* The AI Alchemist */}
            <div className="program-flow-card border-l-4 border-orange-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <h3 className="typo-h3-bs mb-1">Collaboration Mastery</h3>
                  <p className="typo-caption-bs text-gray-600">Creative • Energetic • Intutive</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Thrives on ideation, creativity and innovation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Trusts intuition and adaptability</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Crafts vision—often rally agreements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Best for exploring opportunities, shaping offers, and keeping your decisions aligned with your true resonance.</span>
                </li>
              </ul>
              <button
                onClick={() => onViewChange('chat')}
                className="mt-6 w-full py-3 border-2 border-orange-500 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors font-medium text-center"
              >
                Meet the Alchemist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Your Entrepreneurial DNA */}
      <section className="section-padding-bs bg-white">
        <div className="container-bs-desktop">
          <div className="text-center mb-[var(--bs-spacing-section-heading)]">
            <h2 className="typo-h2-bs mb-4">Discover Your Entrepreneurial DNA</h2>
            <p className="typo-body-bs text-gray-600 max-w-3xl mx-auto">
              Take our E-DNA assessment to map your 7-layer decision architecture – from your core identity (Architect, Alchemist, or Blurred) to your learning style, mirror, and mindset. Then access tools, strategies, and frameworks built for the way you actually think and decide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* The Architect Plan */}
            <div className="program-flow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="typo-h3-bs">The Architect Plan</h3>
              </div>
              <p className="typo-body-bs text-gray-700 mb-4">
                Architects process the world through structure, logic, and systems. Your decision loop starts with clarity, checks emotion against data, then returns to structure. You excel at frameworks, operations, and repeatable processes – when you’re not overloaded. Your biggest risk is rigidness or analysis paralysis; your biggest advantage is consistent, evidence-based execution when supported correctly.
              </p>
            </div>

            {/* The Alchemist Plan */}
            <div className="program-flow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="typo-h3-bs">The Alchemist Plan</h3>
              </div>
              <p className="typo-body-bs text-gray-700 mb-4">
                Alchemists process the world through energy, intuition, and possibility. Your decision loop starts with vision, runs through logic just enough to check feasibility, then returns to momentum and resonance. You excel at creating, connecting, and rallying people – when you’re not scattered. Your biggest risk is inconsistent execution; your biggest advantage is generating opportunities and movement once your loop is stabilised.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => onViewChange('quiz')}
              className="cta-gradient-bs px-8 inline-flex items-center gap-2"
            >
              <span>Take Your E-DNA Quiz Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Choose Your Growth Path - Pricing */}
      <section className="section-padding-bs bg-gray-50">
        <div className="container-bs-desktop">
          <div className="text-center mb-[var(--bs-spacing-section-heading)]">
            <h2 className="typo-h2-bs mb-4">Choose Your Growth Path</h2>
            <p className="typo-body-bs text-gray-600 max-w-2xl mx-auto">
              Phase 1 programmes build your decision intelligence through E-DNA, education, and AI mentorship. Phase 2 unlocks the Mastermind – where collaboration and human mentorship turn clarity into scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Entry Tier */}
            <div className="program-flow-card border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="typo-h3-bs mb-2">Entry</h3>
                <div className="typo-h1-bs mb-2">£499</div>
                <p className="typo-body-bs text-gray-600">Perfect for idea-stage and early-stage entrepreneurs who want to build solid decision foundations and launch with clarity.</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Idea-to-Launch Kit™</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Smart Business Builder™</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">AI Mentor Access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">30-Day Launch Plan</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open("https://launch-kit-uk-blueprint-sh.lovable.app/", "_blank")}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-center"
              >
                Get Started
              </button>
            </div>

            {/* Expert Tier */}
            <div className="program-flow-card border-2 border-purple-600 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Coming Soon
              </div>
              <div className="text-center mb-6">
                <h3 className="typo-h3-bs mb-2">Expert</h3>
                <div className="typo-h1-bs mb-2">£999</div>
                <p className="typo-body-bs text-gray-600">For growing businesses ready to strengthen their decision intelligence and refine offers, messaging, and execution.</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Everything in Entry</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Magnetic Offer Builder™</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">The Energetic Edge™</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Conversion Confidence Kit™</span>
                </li>
              </ul>
              <button 
                disabled
                className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium text-center"
              >
                Coming Soon
              </button>
            </div>

            {/* Elite Tier */}
            <div className="program-flow-card border-2 border-orange-500">
              <div className="text-center mb-6">
                <h3 className="typo-h3-bs mb-2">Elite</h3>
                <div className="typo-h1-bs mb-2">£20k</div>
                <p className="typo-body-bs text-gray-600">For founders who want collaboration mastery, high-level human mentorship, and a private ecosystem to scale with others.</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Full Course Vault Access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Private Mastermind</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">1:1 Strategy Sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="typo-body-bs text-gray-700">Direct Mentor Access</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open("https://brandscalingschoolforentrepreneur.replit.app/", "_blank")}
                className="w-full py-3 bg-gradient-arch-scale-90 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-center"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* If You've Felt This, You're Home */}
      <section className="section-padding-bs bg-white">
        <div className="container-bs-desktop">
          <div className="text-center mb-[var(--bs-spacing-section-heading)]">
            <h2 className="typo-h2-bs mb-4">If You've Felt This, You're Home</h2>
            <p className="typo-body-bs text-gray-600 max-w-3xl mx-auto">
              If you’ve felt this, you’re home.
Each pattern below is a decision problem first – not a personality flaw. E-DNA shows you what your brain is trying to do and how to work with it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="program-flow-card text-center">
              <h3 className="typo-h3-bs mb-3">Idea-Stuck Creatives</h3>
              <p className="typo-body-bs text-gray-600">
                You see the vision clearly but your decision loop freezes at execution, so ideas pile up instead of shipping.
              </p>
            </div>
            <div className="program-flow-card text-center">
              <h3 className="typo-h3-bs mb-3">Framework-Frustrated</h3>
              <p className="typo-body-bs text-gray-600">
                You’ve tried “proven systems”, but your brain doesn’t think in their order – so you follow, then abandon, then restart.
              </p>
            </div>
            <div className="program-flow-card text-center">
              <h3 className="typo-h3-bs mb-3">Momentum-Unstable</h3>
              <p className="typo-body-bs text-gray-600">
                You sprint, crash, and struggle to sustain growth because your decisions swing between overdrive and avoidance.
              </p>
            </div>
            <div className="program-flow-card text-center">
              <h3 className="typo-h3-bs mb-3">Specialist-Went-Broke</h3>
              <p className="typo-body-bs text-gray-600">
                You hired experts, but without a stable decision loop you couldn’t direct, filter, or integrate their work into real growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Begin Your Journey CTA */}
      <section className="section-padding-bs bg-gradient-arch-scale">
        <div className="container-bs-desktop">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="typo-h2-bs text-white mb-6">
              Begin Your Journey to Decision Intelligence
            </h2>
            <p className="typo-body-bs text-white/90 mb-12">
              Every breakthrough in your business starts with one shift: thinking and deciding at a higher level. Your E-DNA profile shows you how your brain actually makes decisions, our education system trains you to stabilise your loop, and our AI mentors help you practise better decisions every day.
            </p>
            <button
              onClick={() => onViewChange('quiz')}
              className="cta-gradient-bs px-8 bg-white text-[var(--bs-color-indigo)] hover:bg-gray-50 inline-flex items-center gap-2"
              style={{ 
                background: 'white',
                color: 'var(--bs-color-indigo)'
              }}
            >
              <span>Discover Your E-DNA</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Final Text Section */}
      <section className="section-padding-bs bg-white">
        <div className="container-bs-desktop">
          <div className="max-w-3xl mx-auto text-center">
            <p className="typo-body-bs text-gray-700 mb-4">
  <span className="font-semibold">Stuck at a Ceiling and Can’t See Why?</span>
  <br />
  The real block is rarely more tactics. It’s an unstable decision loop – overthinking, emotional swings, or constant second-guessing. Your E-DNA shows you exactly how you decide, where you drift, and how to correct it so every move compounds.
</p>
            <button
              onClick={() => onViewChange('quiz')}
              className="text-[var(--bs-color-indigo)] hover:underline font-medium"
            >
              Take your Entrepreneurial-Decision Network Assessment →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onViewChange={onViewChange} />
    </div>
  );
}


// /**
//  * Home Component
//  * Replicated from Brandscaling reference design
//  */

// import { Button } from './ui/button';
// import { Brain, CheckCircle, ArrowRight, Target, Lightbulb, Users, TrendingUp } from 'lucide-react';
// import { Footer } from './Footer';
// import timelineBgVideo from '../assets/timeline-bg.mp4';

// interface HomeProps {
//   onViewChange: (view: string) => void;
// }

// export function Home({ onViewChange }: HomeProps) {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <section className="section-padding-bs bg-white relative overflow-hidden">
//         {/* Background Video */}
//         <div className="absolute inset-0 z-0">
//           <video
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-full h-full object-cover opacity-20 -translate-y-20"
//           >
//             <source src={timelineBgVideo} type="video/mp4" />
//           </video>
//         </div>
//         <div className="container-bs-desktop relative z-10">
//           <div className="text-center max-w-4xl mx-auto">
//             <h1 className="typo-h1-bs mb-6">
//               The World's 1st AI-Powered<br />Decision Intelligence And <br />
//               <span className="text-gradient-arch-scale">Collaboration Mastery Ecosystem</span>
//             </h1>
//             <p className="typo-body-bs text-gray-700 max-w-2xl mx-auto mb-8">
//               Discover your Entrepreneurial DNA and scale from idea to 9-figures using proven methodologies and AI-powered guidance
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//               <button
//                 onClick={() => onViewChange('quiz')}
//                 className="cta-gradient-bs px-8 flex items-center justify-center gap-2"
//               >
//                 <span>Discover Your DNA</span>
//               </button>
//               <Button 
//                 size="lg" 
//                 variant="outline"
//                 onClick={() => onViewChange('courses')}
//                 className="h-[var(--bs-cta-height)] px-8 border-2"
//               >
//                 Explore Learning Paths
//               </Button>
//             </div>
//             <p className="typo-caption-bs text-gray-500">
//               <span className="font-semibold">"Purpose → Profit → Purpose. Every entrepreneur is either an Architect or an Alchemist. Which are you?"</span>
//               <br />
//               <span className="text-gradient-arch-scale font-medium">— The Architect & The Alchemist</span>
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Meet Your AI Business Advisors */}
//       <section className="section-padding-bs bg-gray-50">
//         <div className="container-bs-desktop">
//           <div className="text-center mb-[var(--bs-spacing-section-heading)]">
//             <h2 className="typo-h2-bs mb-4">Meet Your AI Business Advisors</h2>
//             <p className="typo-body-bs text-gray-600 max-w-3xl mx-auto">
//               Two distinct AI personalities, each built to serve one of the two entrepreneurial DNA types. Choose the advisor that matches your operating style—or take our quiz to discover which one you are.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
//             {/* The AI Architect */}
//             <div className="program-flow-card border-l-4 border-purple-600">
//               <div className="flex items-start gap-4 mb-6">
//                 <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
//                   <Target className="w-6 h-6 text-purple-700" />
//                 </div>
//                 <div>
//                   <h3 className="typo-h3-bs mb-1">The AI Architect</h3>
//                   <p className="typo-caption-bs text-gray-600">Logical • Data • Strategic</p>
//                 </div>
//               </div>
//               <ul className="space-y-3">
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Systematises processes & structures</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Builds repeatable, scalable systems</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Prioritises data-driven decisions</span>
//                 </li>
//               </ul>
//               <button
//                 onClick={() => onViewChange('chat')}
//                 className="mt-6 w-full py-3 border-2 border-purple-600 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium text-center"
//               >
//                 Meet the Architect
//               </button>
//             </div>

//             {/* The AI Alchemist */}
//             <div className="program-flow-card border-l-4 border-orange-500">
//               <div className="flex items-start gap-4 mb-6">
//                 <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
//                   <Lightbulb className="w-6 h-6 text-orange-700" />
//                 </div>
//                 <div>
//                   <h3 className="typo-h3-bs mb-1">The AI Alchemist</h3>
//                   <p className="typo-caption-bs text-gray-600">Creative • Energetic • Experimental</p>
//                 </div>
//               </div>
//               <ul className="space-y-3">
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Thrives on ideation, creativity and innovation</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Trusts intuition and adaptability</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Crafts vision—often rally agreements</span>
//                 </li>
//               </ul>
//               <button
//                 onClick={() => onViewChange('chat')}
//                 className="mt-6 w-full py-3 border-2 border-orange-500 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors font-medium text-center"
//               >
//                 Meet the Alchemist
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Discover Your Entrepreneurial DNA */}
//       <section className="section-padding-bs bg-white">
//         <div className="container-bs-desktop">
//           <div className="text-center mb-[var(--bs-spacing-section-heading)]">
//             <h2 className="typo-h2-bs mb-4">Discover Your Entrepreneurial DNA</h2>
//             <p className="typo-body-bs text-gray-600 max-w-3xl mx-auto">
//               Take our scientifically validated quiz to reveal whether you're an Architect or an Alchemist—then access the tools, strategies, and frameworks designed for the way you think and operate best.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
//             {/* The Architect Plan */}
//             <div className="program-flow-card">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
//                   <Target className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="typo-h3-bs">The Architect Plan</h3>
//               </div>
//               <p className="typo-body-bs text-gray-700 mb-4">
//                 Systematic, builders who crave order, structure, data-driven processes. Architects excel at creating frameworks, managing systems and executing with precision. Your strength is clarity, structure, and evidence-based decision-making.
//               </p>
//               <p className="typo-body-bs text-gray-700">
//                 If you think in frameworks, you're wired to process signals based on proven structures, and prefer repeatability—you're an Architect.
//               </p>
//             </div>

//             {/* The Alchemist Plan */}
//             <div className="program-flow-card">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
//                   <Lightbulb className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="typo-h3-bs">The Alchemist Plan</h3>
//               </div>
//               <p className="typo-body-bs text-gray-700 mb-4">
//                 Innovative visionaries who work through intuition, adapt quickly, and thrive on experimentation. Your greatest strength is your ability to create, iterate and pivot—transforming ideas into tangible opportunities.
//               </p>
//               <p className="typo-body-bs text-gray-700">
//                 If you trust your gut, make connections others miss, and find structure limiting—you're an Alchemist.
//               </p>
//             </div>
//           </div>

//           <div className="text-center">
//             <button
//               onClick={() => onViewChange('quiz')}
//               className="cta-gradient-bs px-8 inline-flex items-center gap-2"
//             >
//               <span>Take Your DNA Quiz Now</span>
//               <ArrowRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Choose Your Growth Path - Pricing */}
//       <section className="section-padding-bs bg-gray-50">
//         <div className="container-bs-desktop">
//           <div className="text-center mb-[var(--bs-spacing-section-heading)]">
//             <h2 className="typo-h2-bs mb-4">Choose Your Growth Path</h2>
//             <p className="typo-body-bs text-gray-600 max-w-2xl mx-auto">
//               From first idea to 8-figure scaling. All DNA-personalised. All step-by-step.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {/* Entry Tier */}
//             <div className="program-flow-card border-2 border-gray-200">
//               <div className="text-center mb-6">
//                 <h3 className="typo-h3-bs mb-2">Entry</h3>
//                 <div className="typo-h1-bs mb-2">£499</div>
//                 <p className="typo-body-bs text-gray-600">Perfect for idea-stage entrepreneurs</p>
//               </div>
//               <ul className="space-y-3 mb-8">
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Idea-to-Launch Kit™</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Smart Business Builder™</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">AI Mentor Access</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">30-Day Launch Plan</span>
//                 </li>
//               </ul>
//               <button 
//                 onClick={() => window.open("https://launch-kit-uk-blueprint-sh.lovable.app/", "_blank")}//onViewChange('courses')}
//                 className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-center"
//               >
//                 Get Started
//               </button>
//             </div>

//             {/* Expert Tier */}
//             <div className="program-flow-card border-2 border-purple-600 relative">
//               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
//                 Coming Soon
//               </div>
//               <div className="text-center mb-6">
//                 <h3 className="typo-h3-bs mb-2">Expert</h3>
//                 <div className="typo-h1-bs mb-2">£999</div>
//                 <p className="typo-body-bs text-gray-600">For growing businesses ready to scale</p>
//               </div>
//               <ul className="space-y-3 mb-8">
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Everything in Entry</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Magnetic Offer Builder™</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">The Energetic Edge™</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Conversion Confidence Kit™</span>
//                 </li>
//               </ul>
//               <button 
//                 disabled
//                 className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium text-center"
//               >
//                 Coming Soon
//               </button>
//             </div>

//             {/* Elite Tier */}
//             <div className="program-flow-card border-2 border-orange-500">
//               <div className="text-center mb-6">
//                 <h3 className="typo-h3-bs mb-2">Elite</h3>
//                 <div className="typo-h1-bs mb-2">£20k</div>
//                 <p className="typo-body-bs text-gray-600">Complete scaling ecosystem + mastermind</p>
//               </div>
//               <ul className="space-y-3 mb-8">
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Full Course Vault Access</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Private Mastermind</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">1:1 Strategy Sessions</span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="typo-body-bs text-gray-700">Direct Mentor Access</span>
//                 </li>
//               </ul>
//               <button 
//                 onClick={() => window.open("https://brandscalingschoolforentrepreneur.replit.app/", "_blank")}
//                 className="w-full py-3 bg-gradient-arch-scale-90 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-center"
//               >
//                 Apply Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* If You've Felt This, You're Home */}
//       <section className="section-padding-bs bg-white">
//         <div className="container-bs-desktop">
//           <div className="text-center mb-[var(--bs-spacing-section-heading)]">
//             <h2 className="typo-h2-bs mb-4">If You've Felt This, You're Home</h2>
//             <p className="typo-body-bs text-gray-600 max-w-3xl mx-auto">
//               Entrepreneurs told "you're wired wrong" or that they need to change who they are to scale. At Brandscaling, we reject this mentality and do the opposite. We help you thrive.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="program-flow-card text-center">
//               <h3 className="typo-h3-bs mb-3">Idea-Stuck Creatives</h3>
//               <p className="typo-body-bs text-gray-600">
//                 You have the ideas but freeze when it comes to execution
//               </p>
//             </div>
//             <div className="program-flow-card text-center">
//               <h3 className="typo-h3-bs mb-3">Framework-Frustrated</h3>
//               <p className="typo-body-bs text-gray-600">
//                 You've tried "proven systems" but they feel lifeless
//               </p>
//             </div>
//             <div className="program-flow-card text-center">
//               <h3 className="typo-h3-bs mb-3">Momentum-Unstable</h3>
//               <p className="typo-body-bs text-gray-600">
//                 You sprint, crash, and struggle to sustain growth
//               </p>
//             </div>
//             <div className="program-flow-card text-center">
//               <h3 className="typo-h3-bs mb-3">Specialist-Went-Broke</h3>
//               <p className="typo-body-bs text-gray-600">
//                 You hired experts but results never materialised
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Begin Your Journey CTA */}
//       <section className="section-padding-bs bg-gradient-arch-scale">
//         <div className="container-bs-desktop">
//           <div className="max-w-4xl mx-auto text-center">
//             <h2 className="typo-h2-bs text-white mb-6">
//               Begin Your Journey to 9-Figure Scale
//             </h2>
//             <p className="typo-body-bs text-white/90 mb-12">
//               Every billion-dollar business started with one entrepreneur discovering their true DNA and scaling accordingly. Your breakthrough moment starts now.
//             </p>
//             <button
//               onClick={() => onViewChange('quiz')}
//               className="cta-gradient-bs px-8 bg-white text-[var(--bs-color-indigo)] hover:bg-gray-50 inline-flex items-center gap-2"
//               style={{ 
//                 background: 'white',
//                 color: 'var(--bs-color-indigo)'
//               }}
//             >
//               <span>Discover Your DNA</span>
//               <ArrowRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Final Text Section */}
//       <section className="section-padding-bs bg-white">
//         <div className="container-bs-desktop">
//           <div className="max-w-3xl mx-auto text-center">
//             <p className="typo-body-bs text-gray-700 mb-4">
//               <span className="font-semibold">Stuck at 6-figures or 7-figures and wondering why?</span> The only thing standing between you and scale is knowing your Entrepreneurial DNA—and acting accordingly.
//             </p>
//             <button
//               onClick={() => onViewChange('quiz')}
//               className="text-[var(--bs-color-indigo)] hover:underline font-medium"
//             >
//               Take your DNA Assessment →
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer onViewChange={onViewChange} />
//     </div>
//   );
// }
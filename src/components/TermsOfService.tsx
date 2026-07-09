/**
 * Terms of Service Component
 * Brandscaling - Terms of Service Page
 * Clean, professional design
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Footer } from './Footer';

interface TermsOfServiceProps {
  onViewChange: (view: string) => void;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function TermsSection({ title, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-semibold text-gray-900 pr-4">{title}</h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-8 prose prose-gray max-w-none">
          {children}
        </div>
      )}
    </div>
  );
}

export function TermsOfService({ onViewChange }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <p className="text-sm text-gray-500 mb-4">Updated: 3 February 2026</p>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-base text-gray-600">
          Effective: 3 February 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        
        <TermsSection title="1. Introduction & Agreement" defaultOpen={true}>
          <p>
            These Terms of Service ("Terms") govern your access to and use of the Brandscaling iOS
            application (the "App") and related services. By downloading, accessing, or using the App,
            you agree to be bound by these Terms. If you do not agree, you must not use the App.
          </p>
        </TermsSection>

        <TermsSection title="2. About Brandscaling's Service">
          <p>
            Brandscaling is a Decision Intelligence and Collaboration ecosystem for entrepreneurs. The
            App provides access to the E-DNA assessment, educational pathways, interactive workbooks,
            and AI-guided mentorship tools. Brandscaling is an educational and developmental platform,
            not a regulated professional service.
          </p>
        </TermsSection>

        <TermsSection title="3. Eligibility">
          <p>
            You must be at least 18 years old and legally capable of entering into a binding agreement to
            use the App.
          </p>
        </TermsSection>

        <TermsSection title="4. Account Registration">
          <p>
            To access certain features, you must create an account. You agree to provide accurate
            information, maintain the confidentiality of your login credentials, and accept responsibility
            for all activity under your account.
          </p>
        </TermsSection>

        <TermsSection title="5. Data Protection and Privacy">
          <p>
            Your use of the App is also governed by our{' '}
            <button 
              onClick={() => onViewChange('privacy-policy')}
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </button>
            , which explains how we collect, use, and protect your personal information. By using the App, you acknowledge that you
            have read and understood our Privacy Policy.
          </p>
        </TermsSection>

        <TermsSection title="6. E-DNA and Decision Intelligence Disclaimer">
          <p>
            The E-DNA and decision intelligence frameworks are for entrepreneurial growth and support.
            E-DNA is <strong>not</strong>:
          </p>
          <ul>
            <li>A medical, psychological, or clinical diagnostic tool</li>
            <li>A substitute for professional mental health services</li>
            <li>A predictor of business success</li>
            <li>A guarantee of any specific results</li>
          </ul>
          <p>
            You remain solely responsible for all business decisions, actions, and outcomes.
          </p>
        </TermsSection>

        <TermsSection title="7. AI Mentor Terms">
          <p>
            The App includes two AI mentors (AI-Architect and AI-Alchemist) that provide strategic
            decision-support. They are not a substitute for regulated professional services (legal, medical,
            or financial advice). Users remain responsible for all decisions and outcomes.
          </p>
        </TermsSection>

        <TermsSection title="8. Acceptable Use Rules">
          <p>You agree not to:</p>
          <ul>
            <li>Misuse the App</li>
            <li>Attempt unauthorised access</li>
            <li>Reverse-engineer proprietary frameworks</li>
            <li>Upload unlawful content</li>
          </ul>
          <p>We reserve the right to investigate and take action for violations.</p>
        </TermsSection>

        <TermsSection title="9. Intellectual Property">
          <p>
            All content, frameworks, and materials provided through the App are owned by Brandscaling
            or its licensors. You are granted a limited, personal, non-transferable licence to use the App
            for your own entrepreneurial development. You may not reproduce, resell, or distribute
            Brandscaling materials without written permission.
          </p>
        </TermsSection>

        <TermsSection title="10. Third-Party Services">
          <p>
            The App may rely on third-party services (AI providers, cloud hosting, analytics). Your use
            of such services may be subject to their own terms. Brandscaling is not responsible for the
            availability or performance of third-party services.
          </p>
        </TermsSection>

        <TermsSection title="11. Payments, Subscriptions, and Refunds">
          <p>
            All purchases, including subscriptions and AI Mentor Credits, are processed through Apple's
            In-App Purchase system.
          </p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Subscriptions</h3>
          <p>
            Subscriptions automatically renew unless cancelled at least 24 hours before
            the end of the current period. You can manage and cancel subscriptions in your Apple ID
            account settings. The subscription fee will be charged to your Apple ID account upon
            confirmation of purchase.
          </p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">AI Mentor Credits</h3>
          <p>
            AI Mentor Credits are consumed when using AI mentor features.
            Unused credits expire 12 months after the date of purchase. All purchases are non-transferable.
          </p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Refunds</h3>
          <p>
            All purchases are non-refundable. To request a refund, visit{' '}
            <a 
              href="https://reportaproblem.apple.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              reportaproblem.apple.com
            </a>{' '}
            or contact Apple Support directly. Refund approval is determined solely by Apple according to their policies.
          </p>
        </TermsSection>

        <TermsSection title="12. User Content">
          <p>
            You retain ownership of content you submit (workbook responses, AI mentor conversations).
            By submitting content, you grant Brandscaling a licence to use, process, and analyze your
            content to:
          </p>
          <ul>
            <li>Provide and improve the App's services</li>
            <li>Train AI models</li>
            <li>Generate anonymized insights</li>
          </ul>
          <p>
            You may opt-out of having your content used for AI training in the App's settings.
          </p>
        </TermsSection>

        <TermsSection title="13. Data Export and Portability">
          <p>
            You may request an export of your personal data and workbook entries in accordance with
            our Privacy Policy and UK GDPR.
          </p>
        </TermsSection>

        <TermsSection title="14. Service Availability">
          <p>
            We may update, modify, suspend, or discontinue the App or any feature at any time. We will
            provide at least 30 days' notice for the discontinuation of any core features where feasible.
          </p>
        </TermsSection>

        <TermsSection title="15. Disclaimer of Warranties">
          <p className="uppercase text-sm">
            THE APP IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF
            ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            AND NON-INFRINGEMENT.
          </p>
        </TermsSection>

        <TermsSection title="16. Termination">
          <p>
            We may suspend or terminate your access if you violate these Terms. You may terminate
            your account at any time. Upon termination, your personal data will be deleted in accordance
            with our Privacy Policy.
          </p>
        </TermsSection>

        <TermsSection title="17. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, Brandscaling's total liability to you shall not exceed
            the amount you have paid to Brandscaling in the 12 months preceding the claim. Nothing
            limits liability for death or injury caused by negligence, fraud, or liability that cannot be
            excluded under UK law.
          </p>
        </TermsSection>

        <TermsSection title="18. Indemnity">
          <p>
            You agree to indemnify Brandscaling against claims arising from your misuse of the App or
            violation of these Terms.
          </p>
        </TermsSection>

        <TermsSection title="19. Dispute Resolution">
          <p>
            If you have a complaint, contact us first at{' '}
            <a href="mailto:info@brandscaling.co.uk" className="text-blue-600 hover:underline">
              info@brandscaling.co.uk
            </a>
            . We will attempt informal resolution within 30 days. Payment disputes relating to Apple purchases must be
            directed to Apple.
          </p>
        </TermsSection>

        <TermsSection title="20. Governing Law">
          <p>
            These Terms are governed by the laws of England and Wales, and you agree to the exclusive
            jurisdiction of the courts of England and Wales.
          </p>
        </TermsSection>

        <TermsSection title="21. Severability">
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions will
            continue in full force and effect.
          </p>
        </TermsSection>

        <TermsSection title="22. Entire Agreement">
          <p>
            These Terms constitute the entire agreement between you and Brandscaling and supersede all
            prior agreements.
          </p>
        </TermsSection>

        <TermsSection title="23. Assignment">
          <p>
            You may not assign or transfer these Terms without our prior written consent. We may assign
            our rights and obligations under these Terms without restriction.
          </p>
        </TermsSection>

        <TermsSection title="24. Acknowledgment of Apple's Role">
          <p>
            You acknowledge that these Terms are between you and Brandscaling only, not with Apple.
            Apple is not responsible for the App or its content and has no obligation to provide
            maintenance or support. Apple is a third-party beneficiary of these Terms and may enforce
            them against you.
          </p>
        </TermsSection>

        <TermsSection title="25. Changes to Terms">
          <p>
            We may update these Terms periodically. We will notify you of material changes via in-app
            notification or email. Continued use of the App after such notice constitutes acceptance of the
            new Terms.
          </p>
        </TermsSection>

        <TermsSection title="26. Contact Information">
          <p>
            <strong>Brand Scaling Ltd.</strong><br />
            11 Old Bond Street<br />
            Mayfair, London W1S 4PN, UK
          </p>
          <p className="mt-4">
            <strong>Email:</strong>{' '}
            <a href="mailto:info@brandscaling.co.uk" className="text-blue-600 hover:underline">
              info@brandscaling.co.uk
            </a>
          </p>
          <p>
            <strong>Website:</strong>{' '}
            <a 
              href="https://brandscaling.co.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              brandscaling.co.uk
            </a>
          </p>
        </TermsSection>

      </div>

      {/* Footer */}
      <Footer onViewChange={onViewChange} />
    </div>
  );
}


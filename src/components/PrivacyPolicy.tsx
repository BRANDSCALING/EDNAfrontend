/**
 * Privacy Policy Component
 * Brandscaling - Privacy Policy Page
 * Clean, professional design inspired by modern legal document standards
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Footer } from './Footer';

interface PrivacyPolicyProps {
  onViewChange: (view: string) => void;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function PolicySection({ title, children, defaultOpen = false }: SectionProps) {
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

export function PrivacyPolicy({ onViewChange }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <p className="text-sm text-gray-500 mb-4">Updated: 11 March 2026 | Effective: 11 March 2026</p>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Privacy policy</h1>
        <p className="text-base text-gray-600">
          Brandscaling — how we collect, use, and protect your information.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">

        <PolicySection title="1. Introduction" defaultOpen={true}>
          <p>
            Welcome to Brandscaling. This Privacy Policy explains how Brand Scaling Ltd. (&quot;Brandscaling,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares information about you when you use our iOS application (the &quot;App&quot;) and the services provided through it. We are committed to protecting your privacy and ensuring that your personal data is handled with transparency and care.
          </p>
          <p>
            This policy is available within the App at <strong>Settings &gt; Privacy Policy</strong> and online at <strong>brandscaling.co.uk/privacy-policy</strong>.
          </p>
          <p>
            For the purposes of the UK General Data Protection Regulation (UK GDPR), Brand Scaling Ltd. is the data controller.
          </p>
        </PolicySection>

        <PolicySection title="2. Information We Collect">
          <p>We collect information in a few different ways to provide and improve our services.</p>
          <h3 className="text-lg font-semibold mt-4 mb-3">2.1 Information You Provide Directly</h3>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your name and email address.</li>
            <li><strong>E-DNA Profile Data:</strong> We collect your responses to the E-DNA (Entrepreneurial DNA) assessment questions. This information is used to generate your unique E-DNA profile.</li>
            <li><strong>Workbook Data:</strong> We collect the content you create and input into your workbooks, including your goals, reflections, and answers to prompts.</li>
          </ul>
          <h3 className="text-lg font-semibold mt-6 mb-3">2.2 Information Collected Automatically</h3>
          <p>
            <strong>Device and Usage Information:</strong> We collect information about your device and how you interact with our App. This includes device type, operating system, app version, crash reports, and analytics on feature usage. This data is anonymised or aggregated and is not linked to your personal account.
          </p>
        </PolicySection>

        <PolicySection title="3. Apple Privacy Data Types — Disclosure">
          <p>
            We are transparent about the data we collect, as outlined in our App Store privacy details. The table below summarises this for your convenience.
          </p>
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Data Type</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">What We Collect</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Purpose of Use</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Linked to Your Identity</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-3 py-2 font-medium">Contact Info</td><td className="border border-gray-200 px-3 py-2">Name, Email Address</td><td className="border border-gray-200 px-3 py-2">App functionality, account management, communications</td><td className="border border-gray-200 px-3 py-2">Yes</td></tr>
                <tr><td className="border border-gray-200 px-3 py-2 font-medium">User Content</td><td className="border border-gray-200 px-3 py-2">E-DNA assessment responses, workbook entries, AI chat history</td><td className="border border-gray-200 px-3 py-2">App functionality, personalised guidance, AI agent features</td><td className="border border-gray-200 px-3 py-2">Yes</td></tr>
                <tr><td className="border border-gray-200 px-3 py-2 font-medium">Identifiers</td><td className="border border-gray-200 px-3 py-2">User ID, Device ID</td><td className="border border-gray-200 px-3 py-2">App functionality, analytics</td><td className="border border-gray-200 px-3 py-2">Yes (User ID), No (Device ID)</td></tr>
                <tr><td className="border border-gray-200 px-3 py-2 font-medium">Diagnostics</td><td className="border border-gray-200 px-3 py-2">Crash data, performance data</td><td className="border border-gray-200 px-3 py-2">App analytics, improving app stability</td><td className="border border-gray-200 px-3 py-2">No</td></tr>
                <tr><td className="border border-gray-200 px-3 py-2 font-medium">Usage Data</td><td className="border border-gray-200 px-3 py-2">Product interaction data</td><td className="border border-gray-200 px-3 py-2">App analytics, product improvement</td><td className="border border-gray-200 px-3 py-2">No</td></tr>
              </tbody>
            </table>
          </div>
        </PolicySection>

        <PolicySection title="4. How We Use Your Information">
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>To create and manage your account.</li>
            <li>To generate your personalised E-DNA profile and provide you with tailored insights.</li>
            <li>To power the Decision Intelligence Agent features.</li>
            <li>To enable you to create, store, and manage your workbooks.</li>
            <li>To monitor and analyse usage and trends to improve the App&apos;s performance and user experience.</li>
            <li>To communicate with you about your account or updates to our services.</li>
          </ul>
        </PolicySection>

        <PolicySection title="5. Third-Party AI Processing">
          <p>
            To provide our Decision Intelligence Agent features, we use services from trusted third-party AI providers (OpenAI, Anthropic, Google, DeepSeek). This section explicitly details the data shared with these services.
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-3">5.1 What Data Is Sent to Third Parties?</h3>
          <p>
            When you interact with the Decision Intelligence Agent, we send a limited, session-scoped set of your data to our AI partners to generate a relevant response. <strong>We never share your name, email, or other direct personal identifiers with these partners.</strong> The specific data transmitted is as follows:
          </p>
          <ul>
            <li><strong>Your E-DNA Profile Summary:</strong> A high-level summary of your E-DNA type (e.g., &quot;Architect, Alchemist&quot;).</li>
            <li><strong>Your Current Query:</strong> The specific question or prompt you just entered into the chat.</li>
            <li><strong>Recent Conversation History:</strong> The immediate preceding turns of your conversation with the AI agent to provide context.</li>
          </ul>
          <h3 className="text-lg font-semibold mt-6 mb-3">5.2 Who Receives This Data?</h3>
          <p>
            Your data may be sent to one or more of the following trusted service providers, depending on the AI model you select within the App, for the sole purpose of delivering the AI Agent service:
          </p>
          <ul>
            <li><strong>OpenAI, L.L.C.</strong> (San Francisco, USA)</li>
            <li><strong>Anthropic, PBC</strong> (San Francisco, USA)</li>
            <li><strong>Google, LLC (for Gemini)</strong> (Mountain View, USA)</li>
            <li><strong>DeepSeek, Ltd.</strong> (Hangzhou, China)</li>
          </ul>
          <h3 className="text-lg font-semibold mt-6 mb-3">5.3 Your Permission — Explicit Consent Before Data Is Shared</h3>
          <p>
            In compliance with Apple&apos;s guidelines, <strong>we will not transmit any of your data to a third-party AI service without your explicit permission.</strong> This applies to both registered and guest users.
          </p>
          <p>Before you can use the AI agent&apos;s features for the first time, the App will present a clear, one-time consent screen. This screen will:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>State that the feature uses third-party AI services to function.</li>
            <li>Clearly list the specific data that will be shared (as detailed in Section 5.1).</li>
            <li>Name the third parties who may receive the data (OpenAI, Anthropic, Google, DeepSeek).</li>
            <li>Require you to actively tap a button to provide your consent before proceeding.</li>
          </ol>
          <p>If you do not consent, the rest of the App remains fully functional, but the AI agent&apos;s features will be disabled.</p>
          <h3 className="text-lg font-semibold mt-6 mb-3">5.4 Withdrawing Consent</h3>
          <p>
            If you have previously granted consent and wish to withdraw it, you can do so at any time. Navigate to <strong>Settings &gt; Privacy &gt; AI Agent Data</strong> and select <strong>&quot;Withdraw Consent.&quot;</strong> This will immediately disable all AI agent data transmission and deactivate the AI agent features until consent is re-granted.
          </p>
          <h3 className="text-lg font-semibold mt-6 mb-3">5.5 Equal Protection Commitment</h3>
          <p>
            All our third-party AI service providers are contractually bound by Data Processing Agreements (DPAs). These agreements ensure they provide the same or equal protection of your data as stated in this Privacy Policy. They may not use data transmitted from the Brandscaling App for their own advertising, marketing, or to train their models. All international data transfers are governed by Standard Contractual Clauses approved under UK GDPR.
          </p>
        </PolicySection>

        <PolicySection title="6. Other Data Sharing">
          <p><strong>We do not sell your personal data.</strong> We may share limited data with other trusted service providers strictly for the purposes stated:</p>
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Provider</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Location</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Purpose</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Data Shared</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Equal Protection Guaranteed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 font-medium">AWS (Amazon Web Services)</td>
                  <td className="border border-gray-200 px-3 py-2">United States</td>
                  <td className="border border-gray-200 px-3 py-2">Hosting and infrastructure</td>
                  <td className="border border-gray-200 px-3 py-2">Account data, E-DNA profile, workbook data (encrypted)</td>
                  <td className="border border-gray-200 px-3 py-2">Yes — via Standard Contractual Clauses</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 font-medium">Firebase (Google)</td>
                  <td className="border border-gray-200 px-3 py-2">United States</td>
                  <td className="border border-gray-200 px-3 py-2">Analytics and app performance monitoring</td>
                  <td className="border border-gray-200 px-3 py-2">Anonymised usage and diagnostic data</td>
                  <td className="border border-gray-200 px-3 py-2">Yes — via Standard Contractual Clauses</td>
                </tr>
              </tbody>
            </table>
          </div>
        </PolicySection>

        <PolicySection title="7. Guest Users and Data Collection">
          <p>
            If you use features of the App that are available without creating an account (such as the guest-accessible AI chat), we will not collect any personal data from you. As noted in Section 5.3, we will still ask for your explicit consent before transmitting any chat data to our third-party AI partners. Any interaction with the AI Agent in a guest mode will be processed anonymously and will not be linked to any device or user identifier.
          </p>
        </PolicySection>

        <PolicySection title="8. Future Features (Phase 2)">
          <p>
            Brandscaling is an evolving ecosystem. Future versions of the App may include additional features that require new data processing, such as:
          </p>
          <ul>
            <li><strong>Social Logins (Apple, Google):</strong> To provide alternative ways to create an account.</li>
            <li><strong>Team Collaboration Features:</strong> To allow you to share insights or workbooks with team members within the App.</li>
            <li><strong>Advanced AI Capabilities:</strong> Including features that may process additional data types (such as workbook content) to provide deeper, more personalised insights. For example, we may use a vector database (e.g., from Pinecone Systems, Inc.) to allow the AI to find relevant information from your past work without sending the raw text for every query.</li>
          </ul>
          <p>
            Before any such features are enabled, this Privacy Policy will be updated, and we will obtain your explicit consent for any new data sharing where required.
          </p>
        </PolicySection>

        <PolicySection title="9. Legal Bases for Processing (UK GDPR)">
          <p>We process personal data only where a valid legal basis applies:</p>
          <ul>
            <li><strong>Performance of a Contract:</strong> To provide account access, E-DNA profile generation, and workbook functionality.</li>
            <li><strong>Legitimate Interests:</strong> To monitor app performance, ensure security, and improve services.</li>
            <li><strong>Consent:</strong> For all AI agent data processing involving transmission to third parties.</li>
          </ul>
        </PolicySection>

        <PolicySection title="10. Data Storage, Retention, and Deletion">
          <p>
            We retain your personal data for as long as your account remains active. If you delete your account, your personal data will be permanently deleted within 30 days, except where retention is required for legal or accounting purposes.
          </p>
          <p>
            <strong>In-App Account Deletion:</strong> You can permanently delete your Brandscaling account and all associated personal data directly from within the App at any time. To do so, navigate to <strong>Settings &gt; Account &gt; Delete Account</strong>. You will be asked to confirm your decision before deletion is initiated. This action is irreversible.
          </p>
        </PolicySection>

        <PolicySection title="11. Your Rights (UK GDPR)">
          <p>
            You have the right to access, correct, or request deletion of your personal data. You may also restrict or object to certain processing and request a copy of your data. To exercise these rights, please contact us.
          </p>
          <p>
            You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at{' '}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              ico.org.uk
            </a>{' '}
            if you believe your data protection rights have been violated.
          </p>
        </PolicySection>

        <PolicySection title="12. Security">
          <p>
            We implement appropriate technical and organisational safeguards, including encryption in transit (TLS) and at rest (AES-256), access controls, and regular monitoring for unauthorised access.
          </p>
        </PolicySection>

        <PolicySection title="13. Tracking Technologies and Apple App Tracking Transparency">
          <p>
            The Brandscaling App does not use cookies or similar technologies to track users across third-party apps or websites for advertising purposes. As a result, the App does not present an App Tracking Transparency (ATT) permission prompt.
          </p>
        </PolicySection>

        <PolicySection title="14. Children's Privacy">
          <p>
            The Brandscaling App is intended exclusively for individuals aged 18 and over. We do not knowingly collect personal data from children.
          </p>
        </PolicySection>

        <PolicySection title="15. In-App Purchases">
          <p>
            The Brandscaling App may offer optional in-app purchases that allow you to buy digital services, features, or content available within the App. These purchases may be presented to you based on your personalised tags, tiers, or other profile characteristics within the Brandscaling ecosystem.
            </p>
            <p>
              All in-app purchases are processed securely through Apple’s App Store payment system using Apple In-App Purchase. When you make a purchase, the payment transaction is handled directly by Apple through your Apple ID account. Brand Scaling Ltd. does not collect or store your payment card details.
              </p>
              <p>
                Apple processes the payment on our behalf and notifies the App of successful transactions so that the purchased digital services can be delivered to your account. 
                </p>
                <p>
                  The digital services and content available through in-app purchases are the intellectual property of Brand Scaling Ltd. and are licensed, not sold, to you for use within the App in accordance with our terms of service.
                  </p>
          </PolicySection>
        <PolicySection title="16. No Refund Policy">
            <p>
            All in-app purchases are final and non-refundable except as required by applicable law. If you believe you are entitled to a refund, you may request one directly through Apple at{' '}
              <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                reportaproblem.apple.com
              </a>
            </p>
          </PolicySection>
        <PolicySection title="17. Purchase Restoration">
          <p>
          If you have previously purchased the Full E-DNA Report, you can restore your purchase at no additional cost by tapping 'Restore Purchases' in the app settings. Restoration requires you to be signed in with the same <strong>Apple ID</strong> used for the original purchase.
          </p>
        </PolicySection>
        <PolicySection title="18. Updates to This Policy">
          <p>
            We may update this Privacy Policy as the App evolves or as legal requirements change. Material changes will be communicated in-app or via email before they take effect. The &quot;Updated&quot; date at the top of this document reflects the date of the most recent revision.
          </p>
        </PolicySection>
        <PolicySection title="19. Contact Us">
          <p>For privacy questions, data protection requests, or to exercise your rights, please contact:</p>
          <p className="mt-4">
            <strong>Brand Scaling Ltd.</strong><br />
            11 Old Bond Street, Mayfair, London W1S 4PN, UK
          </p>
          <p className="mt-4">
            <strong>Email:</strong>{' '}
            <a href="mailto:support@brandscaling.co.uk" className="text-blue-600 hover:underline">
              support@brandscaling.co.uk
            </a>
          </p>
          <p>
            <strong>Website:</strong>{' '}
            <a href="https://brandscaling.co.uk/contact" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              brandscaling.co.uk/contact
            </a>
          </p>
        </PolicySection>

      </div>

      {/* Footer */}
      <Footer onViewChange={onViewChange} />
    </div>
  );
}

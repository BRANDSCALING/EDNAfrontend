/**
 * Contact & Support Component
 * Brandscaling - Contact and Support Page
 * Clean, professional design
 */

import { Mail, Globe, MessageSquare, Bug, CreditCard, Lightbulb } from 'lucide-react';
import { Footer } from './Footer';

interface ContactSupportProps {
  onViewChange: (view: string) => void;
}

export function ContactSupport({ onViewChange }: ContactSupportProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <p className="text-sm text-gray-500 mb-4">Support Centre</p>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Help & Contact</h1>
        <p className="text-lg text-gray-600">
          We're here to help you get the most out of the Brandscaling ecosystem.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        
        {/* FAQ Section */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Frequently Asked Questions</h2>
              <p className="text-gray-600 mb-4">
                For immediate answers to common questions about the E-DNA assessment, AI Mentors, 
                subscriptions, and technical issues, please visit our comprehensive FAQ page.
              </p>
              <a 
                href="https://brandscaling.co.uk/faq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline font-medium"
              >
                Visit FAQ Page →
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Mail className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us Directly</h2>
              <p className="text-gray-600 mb-4">
                If you can't find the answer you're looking for in our FAQ, or if you need to report a 
                technical issue, please contact our support team directly.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium text-gray-900 mb-1">Email</p>
                <a 
                  href="mailto:support@brandscaling.co.uk" 
                  className="text-blue-600 hover:underline"
                >
                  support@brandscaling.co.uk
                </a>
                <p className="text-sm text-gray-500 mt-3">
                  We aim to respond to all inquiries within 24-48 business hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Issues */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Bug className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Technical Issues</h2>
              <p className="text-gray-600 mb-4">
                For technical issues or bug reports, please include the following information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Your device type (e.g., iPhone 14 Pro)</li>
                <li>iOS version</li>
                <li>A brief description of the problem</li>
                <li>Screenshots (highly encouraged)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Billing Issues */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Billing & Subscription Issues</h2>
              <p className="text-gray-600 mb-4">
                All payments are processed through Apple. For billing inquiries or refund requests, 
                you must contact Apple Support directly.
              </p>
              <a 
                href="https://reportaproblem.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline font-medium"
              >
                Visit reportaproblem.apple.com →
              </a>
            </div>
          </div>
        </section>

        {/* Feedback */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Feedback & Suggestions</h2>
              <p className="text-gray-600 mb-4">
                We are constantly working to improve the Brandscaling ecosystem. If you have 
                feedback or suggestions for new features, we'd love to hear from you.
              </p>
              <a 
                href="mailto:feedback@brandscaling.co.uk" 
                className="text-blue-600 hover:underline font-medium"
              >
                feedback@brandscaling.co.uk
              </a>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Globe className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Additional Resources</h2>
              <div className="space-y-3">
                <p>
                  <span className="text-gray-600">Main Website: </span>
                  <a 
                    href="https://brandscaling.co.uk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    brandscaling.co.uk
                  </a>
                </p>
                <p>
                  <span className="text-gray-600">Privacy Policy: </span>
                  <button 
                    onClick={() => onViewChange('privacy-policy')}
                    className="text-blue-600 hover:underline"
                  >
                    View Privacy Policy
                  </button>
                </p>
                <p>
                  <span className="text-gray-600">Terms of Service: </span>
                  <button 
                    onClick={() => onViewChange('terms-of-service')}
                    className="text-blue-600 hover:underline"
                  >
                    View Terms of Service
                  </button>
                </p>
                <p>
                  <span className="text-gray-600">Account deletion: </span>
                  <a
                    href="/delete-account/"
                    className="text-blue-600 hover:underline"
                  >
                    Delete your app account (web)
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <Footer onViewChange={onViewChange} />
    </div>
  );
}


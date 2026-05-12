/**
 * Footer Component
 * Brandscaling - Global Footer
 */

import { ArrowRight } from 'lucide-react';
import brandscalingLogo from 'figma:asset/4ffc1593ac524b5a444c05cca1a8149a7e87be86.png';

interface FooterProps {
  onViewChange: (view: string) => void;
}

export function Footer({ onViewChange }: FooterProps) {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="container-bs-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={brandscalingLogo} alt="Brandscaling" className="h-10 w-auto" />
              <div className="flex flex-col">
                <span className="font-semibold text-white">Brandscaling</span>
                <span className="text-xs text-gray-400">Purpose → Profit → Purpose</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Transforming entrepreneurs from idea to 9-figures through the proven Infinite Scaling Methodology.
            </p>
            <p className="text-gray-300 text-sm italic mb-4">
              "Every entrepreneur is either an Architect or an Alchemist."
            </p>
            <p className="text-orange-500 text-sm font-medium">
              Discover your Entrepreneurial DNA today.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onViewChange('quiz')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Entrepreneurial DNA Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange('courses')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Learning Pathways
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange('chat')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  AI Business Advisors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange('dashboard')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Interactive Workbooks
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onViewChange('about')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  About the Method
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange('home')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Scaling Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange('contact')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange('home')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Community Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Start Scaling CTA */}
          <div>
            <h3 className="font-semibold text-white mb-4">Start Scaling</h3>
            <p className="text-gray-300 text-sm mb-6">
              Ready to discover your Entrepreneurial DNA and begin your infinite scaling journey?
            </p>
            <button
              onClick={() => onViewChange('quiz')}
              className="w-full py-3 bg-gradient-arch-scale-90 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
            >
              <span>Take DNA Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-bs-desktop py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              ©️ 2025 Brandscaling. Building decision intelligence and collaboration mastery for entrepreneurs.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => onViewChange('privacy-policy')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onViewChange('terms-of-service')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </button>
              <a
                href="/delete-account/"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Delete account
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

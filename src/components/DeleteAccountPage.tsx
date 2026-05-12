/**
 * Public account deletion information page (Google Play Data safety — account deletion URL).
 */

import { useEffect } from 'react';
import { Footer } from './Footer';
import { Mail, Smartphone } from 'lucide-react';

interface DeleteAccountPageProps {
  onViewChange: (view: string) => void;
}

const PAGE_TITLE = 'Delete Your BrandScaling Account | BrandScaling';
const META_DESCRIPTION =
  'Request deletion of your BrandScaling app account and associated data.';
const SUPPORT_EMAIL = 'support@brandscaling.co.uk';
const MAILTO_DELETION = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  'BrandScaling Account Deletion Request',
)}&body=${encodeURIComponent(
  "I request deletion of my BrandScaling app account and associated data.\n\nEmail used in the app: \nAdditional details: ",
)}`;

export function DeleteAccountPage({ onViewChange }: DeleteAccountPageProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    let meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    const addedMeta = !meta;
    const previousDescription = meta?.getAttribute('content') ?? '';
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', META_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (addedMeta && meta) {
        meta.remove();
      } else if (meta) {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <p className="text-sm text-gray-500 mb-4">Account &amp; data</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Delete Your BrandScaling Account
        </h1>
        <p className="text-lg text-gray-600">
          This page is for users of the BrandScaling mobile app who want to
          request deletion of their account and associated app data.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16 space-y-12 text-gray-700">
        <section aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-2xl font-semibold text-gray-900 mb-4">
            Overview
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              BrandScaling users can request deletion of their app account and
              associated data using this page or directly inside the BrandScaling
              mobile app.
            </p>
            <p>
              To delete your account in the app, open the BrandScaling app, go to
              Settings, then choose Delete Account. If you cannot access the app,
              you can request deletion by contacting us using the details below.
            </p>
            <p>
              When we process an eligible deletion request, we aim to delete or
              anonymise account data associated with your BrandScaling app account,
              including profile data, assessment responses, saved preferences, and
              AI mentor or chat data where applicable. Some limited records may be
              retained where necessary for legal, security, fraud-prevention,
              dispute-resolution, compliance, or accounting purposes.
            </p>
            <p>
              To request deletion by email, contact{' '}
              <a
                className="text-blue-600 hover:underline font-medium"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>{' '}
              from the email address linked to your BrandScaling app account and
              include the statement: &quot;I request deletion of my BrandScaling app
              account and associated data.&quot; Do not send your password or payment
              information.
            </p>
            <p>
              We may contact you if we need to verify account ownership before
              completing the request. For more information about how BrandScaling
              handles data, please review our{' '}
              <a
                className="text-blue-600 hover:underline font-medium"
                href="https://www.brandscaling.co.uk/privacy-policy/"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>

        <section aria-labelledby="deleted-heading">
          <h2 id="deleted-heading" className="text-2xl font-semibold text-gray-900 mb-4">
            What may be deleted
          </h2>
          <p className="text-gray-600 mb-4">
            A deletion request may include the following categories of data tied to
            your account, subject to verification and applicable law:
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <caption className="sr-only">
                Categories of data that may be deleted with your account
              </caption>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900 align-top">
                    App account / profile
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    Profile and account information stored for the BrandScaling app.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900 align-top">
                    Authentication account
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    The authentication account linked to the app, where applicable.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900 align-top">
                    Quiz / assessment
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    Quiz or assessment responses associated with your account.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900 align-top">
                    Preferences
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    Saved app preferences associated with your account.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900 align-top">
                    AI mentor / chat
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    AI mentor or chat history associated with your account, where
                    applicable.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900 align-top">
                    Other linked data
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    Other backend data directly associated with your user account.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="retained-heading">
          <h2 id="retained-heading" className="text-2xl font-semibold text-gray-900 mb-4">
            What may be retained
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Some information may be retained for a limited period, or in
            aggregated or anonymised form, where required for legitimate purposes
            such as legal obligations, security, fraud prevention,
            dispute resolution, regulatory compliance, or accounting. The scope of
            retention depends on the nature of the data and applicable law.
          </p>
        </section>

        <section aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl font-semibold text-gray-900 mb-4">
            How to request deletion
          </h2>
          <ul className="space-y-8 list-none p-0 m-0">
            <li className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-lg shrink-0" aria-hidden="true">
                <Smartphone className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Option A: In the app
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Open the BrandScaling app → Settings → Delete Account.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-lg shrink-0" aria-hidden="true">
                <Mail className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Option B: Email
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Send a request from the email address you use with your
                  BrandScaling app account. You can open a pre-filled message (you
                  may edit the body before sending). Do not include passwords,
                  payment card numbers, or government ID.
                </p>
                <a
                  href={MAILTO_DELETION}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg cta-gradient-bs text-white font-medium hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--bs-color-indigo)]"
                >
                  Email a deletion request
                </a>
              </div>
            </li>
          </ul>
        </section>

        <section aria-labelledby="include-heading">
          <h2 id="include-heading" className="text-2xl font-semibold text-gray-900 mb-4">
            Please include in your request
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>The email address used for your BrandScaling app account</li>
            <li>
              A short statement that you want your account and associated data
              deleted
            </li>
            <li>
              Optional: any extra details that help us identify your account (for
              example, the name on the account). Do not send passwords, payment card
              details, or government-issued ID.
            </li>
          </ul>
        </section>

        <section aria-labelledby="processing-heading">
          <h2 id="processing-heading" className="text-2xl font-semibold text-gray-900 mb-4">
            Processing
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We will review and process eligible deletion requests as soon as
            reasonably possible. We may contact you if we need to verify account
            ownership.
          </p>
        </section>

        <section aria-labelledby="legal-links-heading">
          <h2 id="legal-links-heading" className="text-2xl font-semibold text-gray-900 mb-4">
            Policies
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <a
                href="https://www.brandscaling.co.uk/privacy-policy/"
                className="text-blue-600 hover:underline font-medium"
              >
                Privacy Policy (brandscaling.co.uk)
              </a>
            </li>
            <li>
              <a
                href="https://www.brandscaling.co.uk/terms-of-service/"
                className="text-blue-600 hover:underline font-medium"
              >
                Terms of Service (brandscaling.co.uk)
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-2xl font-semibold text-gray-900 mb-4">
            Contact
          </h2>
          <p className="text-gray-600 leading-relaxed">
            For questions about this process or your data, contact{' '}
            <a
              className="text-blue-600 hover:underline font-medium"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {SUPPORT_EMAIL}
            </a>
            . This page is provided to support the Google Play account deletion URL
            requirement for apps that allow account creation; it does not by itself
            guarantee any store approval outcome.
          </p>
        </section>
      </div>

      <Footer onViewChange={onViewChange} />
    </div>
  );
}

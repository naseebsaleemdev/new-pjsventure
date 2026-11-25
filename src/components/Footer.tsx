import { useState } from 'react';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { PageRoute } from '../types/vehicle';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

interface GlobalOfficeInfo {
  country: string;
  city: string;
  phone: string;
  email: string;
}

const GLOBAL_OFFICES: Record<string, GlobalOfficeInfo> = {
  japan: {
    country: 'Japan (Yokohama HQ)',
    city: 'Daikoku-futo Export Terminal, Yokohama',
    phone: '+81-45-000-0000',
    email: 'dispatch@pjsventure.jp',
  },
  kenya: {
    country: 'Kenya (Mombasa Desk)',
    city: 'Moi Avenue, Mombasa',
    phone: '+254-700-000-410',
    email: 'mombasa@pjsventure.jp',
  },
  tanzania: {
    country: 'Tanzania (Dar es Salaam Desk)',
    city: 'Sokoine Drive, Dar es Salaam',
    phone: '+255-754-000-820',
    email: 'dar@pjsventure.jp',
  },
  pakistan: {
    country: 'Pakistan (Karachi Port Desk)',
    city: 'Mai Kolachi Road, Karachi',
    phone: '+92-21-3560-0000',
    email: 'karachi@pjsventure.jp',
  },
  uae: {
    country: 'UAE (Jebel Ali Desk)',
    city: 'Jebel Ali Free Zone, Dubai',
    phone: '+971-4-000-0090',
    email: 'dubai@pjsventure.jp',
  },
  jamaica: {
    country: 'Jamaica (Kingston Desk)',
    city: 'Port Bustamante Liaison Office, Kingston',
    phone: '+1-876-000-0190',
    email: 'kingston@pjsventure.jp',
  },
};

export function Footer({ onNavigate }: FooterProps) {
  const [selectedOfficeKey, setSelectedOfficeKey] = useState('');

  const selectedOffice = selectedOfficeKey
    ? GLOBAL_OFFICES[selectedOfficeKey]
    : null;

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAFAFA] text-slate-700 border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Main 5-Column Directory */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-12">
          {/* Column 1: Buying */}
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900 mb-3.5">
              Buying
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'used-cars' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Find Cars
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'port-balance' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Port Balance Cars
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'why-choose-us' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Why Choose Pjs Venture
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'reviews' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'blog' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Blog &amp; Export Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Support */}
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900 mb-3.5">
              Support
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'help-center' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'car-tracking' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Car Tracking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'global-protection' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Global Protection Program
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'condition-report' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Damage condition report
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'ports' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Shipping Schedule
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'chassis-check' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  VIN &amp; Chassis Report
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900 mb-3.5">
              About Us
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'about' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Our Company
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'company-profile' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Company Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'global-offices' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Global office
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'csr-policy' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  CSR Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Inquiry */}
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900 mb-3.5">
              Inquiry
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'contact' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'auction' })}
                  className="hover:text-slate-950 hover:underline transition-colors cursor-pointer text-left"
                >
                  Vehicle Request
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect With Us */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-display text-sm font-bold text-slate-900 mb-3.5">
              Connect With Us
            </h3>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-slate-900 mb-4">
              <button
                type="button"
                onClick={() => onNavigate({ name: 'page', slug: 'news' })}
                aria-label="Pjs Venture Video & News"
                className="hover:text-[#B91C1C] transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a2.99 2.99 0 0 0-2.105-2.116C19.538 3.57 12 3.57 12 3.57s-7.538 0-9.393.5A2.99 2.99 0 0 0 .502 6.186 31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .502 5.814 2.99 2.99 0 0 0 2.105 2.116c1.855.5 9.393.5 9.393.5s7.538 0 9.393-.5a2.99 2.99 0 0 0 2.105-2.116A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.502-5.814ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'page', slug: 'reviews' })}
                aria-label="Pjs Venture Customer Community"
                className="hover:text-[#B91C1C] transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.97 3.64 9.09 8.4 9.84v-6.96H7.92V12h2.52V9.8c0-2.49 1.48-3.86 3.75-3.86 1.09 0 2.23.19 2.23.19v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.76l-.44 2.88h-2.32v6.96c4.76-.75 8.4-4.87 8.4-9.84 0-5.5-4.46-9.96-9.96-9.96Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'used-cars' })}
                aria-label="Pjs Venture Vehicle Gallery"
                className="hover:text-[#B91C1C] transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </button>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-800 font-medium mb-5">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'news' })}
                  className="inline-flex items-center gap-1.5 hover:text-[#B91C1C] transition-colors cursor-pointer"
                >
                  <span>Pjs Venture News</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" aria-hidden="true" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'page', slug: 'newsletter' })}
                  className="inline-flex items-center gap-1.5 hover:text-[#B91C1C] transition-colors cursor-pointer"
                >
                  <span>News Letter</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" aria-hidden="true" />
                </button>
              </li>
            </ul>

            {/* Global office selector */}
            <div>
              <label
                htmlFor="footer-global-office"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Global office
              </label>
              <select
                id="footer-global-office"
                value={selectedOfficeKey}
                onChange={(e) => setSelectedOfficeKey(e.target.value)}
                className="w-full max-w-[220px] px-3 py-2 text-xs text-slate-600 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-500 cursor-pointer"
              >
                <option value="">Select a country</option>
                {Object.entries(GLOBAL_OFFICES).map(([key, office]) => (
                  <option key={key} value={key}>
                    {office.country}
                  </option>
                ))}
              </select>

              {selectedOffice && (
                <div className="mt-2.5 p-2.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-600 space-y-0.5 max-w-[220px]">
                  <p className="font-semibold text-slate-900">{selectedOffice.city}</p>
                  <p className="font-mono tabular-nums">{selectedOffice.phone}</p>
                  <p className="font-mono text-slate-500">{selectedOffice.email}</p>
                  <button
                    type="button"
                    onClick={() => onNavigate({ name: 'page', slug: 'global-offices' })}
                    className="pt-1 text-[11px] font-semibold text-[#B91C1C] hover:underline cursor-pointer"
                  >
                    View all offices →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Back to Top Bar */}
      <div className="border-t border-slate-200 bg-[#FAFAFA]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-7 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => onNavigate({ name: 'page', slug: 'terms' })}
                className="hover:text-slate-950 hover:underline cursor-pointer"
              >
                Terms of Use
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'page', slug: 'privacy' })}
                className="hover:text-slate-950 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'page', slug: 'claims-policy' })}
                className="hover:text-slate-950 hover:underline cursor-pointer"
              >
                Claims Policy
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'page', slug: 'anti-social-policy' })}
                className="hover:text-slate-950 hover:underline cursor-pointer"
              >
                Basic policy against Anti-Social Forces
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'page', slug: 'security-export-control' })}
                className="hover:text-slate-950 hover:underline cursor-pointer"
              >
                Security export control
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'page', slug: 'sitemap' })}
                className="hover:text-slate-950 hover:underline cursor-pointer"
              >
                Sitemap
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              All exports comply with JUMVEA inspection standards and the Pjs Venture Privacy Policy and Terms of Service.
            </p>
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} Pjs Venture CO., LTD. All Right Reserved
            </p>
          </div>

          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-[#B91C1C] transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

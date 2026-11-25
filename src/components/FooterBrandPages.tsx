import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Globe2,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Star,
} from 'lucide-react';
import { PageRoute, PortalQuery } from '../types/vehicle';

interface BrandPageProps {
  onNavigate: (route: PageRoute) => void;
  onSubmitQuery?: (
    query: Omit<PortalQuery, 'id' | 'referenceId' | 'status' | 'createdAt'>
  ) => PortalQuery;
}

const REVIEWS_DATA = [
  {
    id: 'r1',
    buyerName: 'Samuel Ochieng',
    company: 'Savannah Horizon Motors · Mombasa, Kenya',
    vehicle: '2022 Toyota Land Cruiser Prado TX-L',
    date: 'October 2026',
    quote:
      'Pjs Venture locked our exact CIF Mombasa rate on the Proforma Invoice, completed QISJ inspection in 4 days, and delivered our Prado cleanly in 24 days.',
  },
  {
    id: 'r2',
    buyerName: 'Andre Campbell',
    company: 'Kingston Auto Imports Ltd. · Kingston, Jamaica',
    vehicle: '2022 Honda Vezel e:HEV + 2019 Toyota Vitz',
    date: 'October 2026',
    quote:
      'Their English USS Tokyo inspection translations and yard undercarriage photos arrived within hours, cutting our landed cost by nearly $1,400 per unit.',
  },
  {
    id: 'r3',
    buyerName: 'Amina Hassan',
    company: 'Dar Transit & Logistics · Dar es Salaam, Tanzania',
    vehicle: '2020 Toyota Hiace Van 2.8D (Port Balance)',
    date: 'September 2026',
    quote:
      'Booked via Port Balance terms at Dar es Salaam. Verified JEVIC mileage certificate matched the odometer and DHL Original B/L arrived ahead of clearance.',
  },
  {
    id: 'r4',
    buyerName: 'Tariq Al-Mansoor',
    company: 'Gulf Horizon Trading LLC · Dubai, UAE',
    vehicle: '2021 Toyota Alphard Executive',
    date: 'September 2026',
    quote:
      'Secured a Grade 5.0 Pearl White Alphard at USS Tokyo and coordinated 20ft container stuffing in Yokohama with zero hidden charges.',
  },
  {
    id: 'r5',
    buyerName: 'Rohan Perera',
    company: 'Lanka Premier Automobiles · Colombo, Sri Lanka',
    vehicle: '2021 Toyota Harrier Hybrid E-Four',
    date: 'August 2026',
    quote:
      'Nagoya yard hybrid battery SOH test confirmed 94% capacity prior to Ro-Ro booking, letting our unit clear Colombo customs in 48 hours.',
  },
  {
    id: 'r6',
    buyerName: 'Bilal Qureshi',
    company: 'Indus Auto Traders · Karachi, Pakistan',
    vehicle: '2019 Toyota Vitz 1.3F (Port Qasim Balance)',
    date: 'August 2026',
    quote:
      'Clean booking deposit at Yokohama and smooth final settlement on vessel arrival at Port Qasim.',
  },
];

const OFFICE_LOCATIONS = [
  {
    country: 'Japan (Headquarters)',
    city: 'Yokohama Export Terminal',
    address: 'Daikoku-futo Export Yard, Tsurumi-ku, Yokohama 230-0054',
    phone: '+81-45-000-0000',
    email: 'dispatch@pjsventure.jp',
    hours: 'Mon–Sat 09:00–18:30 JST',
  },
  {
    country: 'Kenya',
    city: 'Mombasa Clearance Desk',
    address: 'Moi Avenue, Kilindini Port Liaison Suite, Mombasa',
    phone: '+254-700-000-410',
    email: 'mombasa@pjsventure.jp',
    hours: 'Mon–Sat 08:30–17:30 EAT',
  },
  {
    country: 'Tanzania',
    city: 'Dar es Salaam Hub',
    address: 'Sokoine Drive, Port Balance Coordination Office, Dar es Salaam',
    phone: '+255-754-000-820',
    email: 'dar@pjsventure.jp',
    hours: 'Mon–Sat 08:30–17:30 EAT',
  },
  {
    country: 'Pakistan',
    city: 'Karachi Port Qasim Desk',
    address: 'Mai Kolachi Road, Port Qasim & KPT Liaison Office, Karachi',
    phone: '+92-21-3560-0000',
    email: 'karachi@pjsventure.jp',
    hours: 'Mon–Sat 09:30–18:30 PKT',
  },
  {
    country: 'United Arab Emirates',
    city: 'Dubai Jebel Ali Office',
    address: 'Jebel Ali Free Zone South, Gate 4 Export Desk, Dubai',
    phone: '+971-4-000-0090',
    email: 'dubai@pjsventure.jp',
    hours: 'Mon–Sat 09:00–18:00 GST',
  },
  {
    country: 'Jamaica',
    city: 'Kingston Liaison Desk',
    address: 'Port Bustamante Importer Support Desk, Kingston',
    phone: '+1-876-000-0190',
    email: 'kingston@pjsventure.jp',
    hours: 'Mon–Fri 09:00–17:00 EST',
  },
];

const NEWS_DISPATCHES = [
  {
    date: 'November 2026',
    title: 'Port Balance Fleet Expanded for Mombasa, Dar es Salaam & Port Qasim',
    summary:
      'Selected Toyota Hiace, Prius, Vitz, and Mitsubishi Pajero Sport units are now pre-allocated on vessel arrivals with Booking Deposit + Balance at Destination Port terms.',
  },
  {
    date: 'November 2026',
    title: 'Direct Ro-Ro Sailings Confirmed from Yokohama & Hakata for Q4',
    summary:
      'Four confirmed carrier sailings this month reduce East Africa and Caribbean transit waiting times to 22–26 days port-to-port.',
  },
  {
    date: 'October 2026',
    title: 'Hybrid State-of-Health Reports Included on All Hybrid Export Stock',
    summary:
      'Every Toyota Harrier Hybrid, Prius, and Honda Vezel e:HEV now includes battery cell voltage balance verification before shipment.',
  },
];

export function ReviewsPage({ onNavigate }: BrandPageProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="pb-5 border-b border-slate-200">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <button
            type="button"
            onClick={() => onNavigate({ name: 'home' })}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-medium text-slate-900">Customer Reviews</span>
        </nav>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          Verified Importer &amp; Dealership Reviews
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
          Feedback from repeat dealerships, fleet operators, and individual buyers importing directly from Pjs Venture Japan yards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REVIEWS_DATA.map((rev) => (
          <article
            key={rev.id}
            className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-slate-500">{rev.date}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs">
              <p className="font-display font-bold text-slate-950">{rev.buyerName}</p>
              <p className="text-slate-600">{rev.company}</p>
              <p className="font-mono text-[11px] text-[#B91C1C] mt-1">{rev.vehicle}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function GlobalOfficesPage({ onNavigate }: BrandPageProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="pb-5 border-b border-slate-200">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <button
            type="button"
            onClick={() => onNavigate({ name: 'home' })}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-medium text-slate-900">Global Offices</span>
        </nav>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          Pjs Venture Global Offices &amp; Port Desks
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
          Our Yokohama export headquarters coordinates with regional clearance offices to support Port Balance settlements and local buyer assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {OFFICE_LOCATIONS.map((office) => (
          <div
            key={office.country}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#B91C1C]">
              <Globe2 className="w-4 h-4" aria-hidden="true" />
              <span>{office.country}</span>
            </div>
            <h2 className="font-display text-lg font-bold text-slate-950">
              {office.city}
            </h2>
            <div className="space-y-2 text-xs text-slate-600 pt-1">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{office.address}</span>
              </p>
              <p className="flex items-center gap-2 font-mono text-slate-800">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{office.phone}</span>
              </p>
              <p className="flex items-center gap-2 font-mono text-slate-800">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{office.email}</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">{office.hours}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewsNewsletterPage({
  mode,
  onNavigate,
  onSubmitQuery,
}: BrandPageProps & { mode: 'news' | 'newsletter' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [portPref, setPortPref] = useState('Mombasa, Kenya');
  const [subscribedRef, setSubscribedRef] = useState<string | null>(null);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (onSubmitQuery) {
      const created = onSubmitQuery({
        type: 'General Contact',
        buyerName: name.trim() || 'Newsletter Subscriber',
        companyName: 'Weekly Stock List',
        email: email.trim(),
        phoneWhatsApp: 'Email Subscription',
        destinationPort: portPref,
        subject: 'Newsletter & Port Balance Alert Subscription',
        vehicleRefs: [],
        notes: `Subscribed to weekly Japan export stock list and Port Balance vessel updates for ${portPref}.`,
      });
      setSubscribedRef(created.referenceId);
    } else {
      setSubscribedRef('SUB-2026');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="pb-5 border-b border-slate-200">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <button
            type="button"
            onClick={() => onNavigate({ name: 'home' })}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-medium text-slate-900">
            {mode === 'news' ? 'Pjs Venture News' : 'Weekly Stock Newsletter'}
          </span>
        </nav>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          {mode === 'news'
            ? 'Pjs Venture Export News & Vessel Dispatches'
            : 'Subscribe to Weekly Stock & Port Balance Alerts'}
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
          Stay updated on confirmed Japan Ro-Ro departures, incoming Port Balance arrivals, and destination port customs changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          {NEWS_DISPATCHES.map((post) => (
            <article
              key={post.title}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-2"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-[#B91C1C] font-semibold">
                <Newspaper className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{post.date}</span>
              </div>
              <h2 className="font-display text-lg font-bold text-slate-950">
                {post.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{post.summary}</p>
            </article>
          ))}
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-950">
            Weekly Stock &amp; Auction Dispatch
          </h2>
          <p className="text-xs text-slate-600">
            Receive curated Grade 4.0–5.0 stock lists, Port Balance arrivals, and freight rate alerts every Tuesday.
          </p>

          {subscribedRef ? (
            <div className="p-4 bg-[#F8F9FA] border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-mono font-semibold text-emerald-800">
                  {subscribedRef} — Subscription Confirmed
                </p>
                <p className="text-slate-600 mt-1">
                  Weekly stock updates for {portPref} will be sent to {email}.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3 text-xs">
              <div>
                <label htmlFor="nl-name" className="block font-semibold text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  id="nl-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="nl-email" className="block font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="imports@dealership.com"
                  className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="nl-port" className="block font-semibold text-slate-700 mb-1">
                  Preferred Port Updates
                </label>
                <select
                  id="nl-port"
                  value={portPref}
                  onChange={(e) => setPortPref(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  <option value="Mombasa, Kenya">Mombasa, Kenya</option>
                  <option value="Dar es Salaam, Tanzania">Dar es Salaam, Tanzania</option>
                  <option value="Port Qasim (Karachi), Pakistan">Port Qasim, Pakistan</option>
                  <option value="Jebel Ali (Dubai), UAE">Jebel Ali, UAE</option>
                  <option value="Kingston, Jamaica">Kingston, Jamaica</option>
                  <option value="Durban, South Africa">Durban, South Africa</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
              >
                Subscribe to Dispatch
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function SitemapPage({ onNavigate }: BrandPageProps) {
  const groups: { title: string; links: { label: string; route: PageRoute }[] }[] = [
    {
      title: 'Buying & Inventory',
      links: [
        { label: 'Home Portal', route: { name: 'home' } },
        { label: 'Used Cars Inventory', route: { name: 'used-cars' } },
        { label: 'Port Balance Cars', route: { name: 'port-balance' } },
        { label: 'Compare Vehicles', route: { name: 'compare' } },
        { label: 'Why Choose Pjs Venture', route: { name: 'page', slug: 'why-choose-us' } },
        { label: 'Customer Reviews', route: { name: 'page', slug: 'reviews' } },
      ],
    },
    {
      title: 'Support & Verification',
      links: [
        { label: 'Help Center & FAQ', route: { name: 'page', slug: 'help-center' } },
        { label: 'Car & Vessel Tracking', route: { name: 'page', slug: 'car-tracking' } },
        { label: 'VIN & Chassis History Report', route: { name: 'page', slug: 'chassis-check' } },
        { label: 'Global Protection Program', route: { name: 'page', slug: 'global-protection' } },
        { label: 'Damage Condition Report', route: { name: 'page', slug: 'condition-report' } },
        { label: 'Shipping Ports & Schedule', route: { name: 'ports' } },
        { label: 'How to Buy Guide', route: { name: 'how-to-buy' } },
      ],
    },
    {
      title: 'About Pjs Venture & Inquiry',
      links: [
        { label: 'Our Company', route: { name: 'page', slug: 'about' } },
        { label: 'Company Profile', route: { name: 'page', slug: 'company-profile' } },
        { label: 'Global Offices', route: { name: 'page', slug: 'global-offices' } },
        { label: 'CSR Policy', route: { name: 'page', slug: 'csr-policy' } },
        { label: 'Car Auction Access', route: { name: 'auction' } },
        { label: 'Contact Support', route: { name: 'contact' } },
        { label: 'Blog & Export Guides', route: { name: 'blog' } },
        { label: 'Pjs Venture News', route: { name: 'page', slug: 'news' } },
        { label: 'Weekly Newsletter', route: { name: 'page', slug: 'newsletter' } },
      ],
    },
    {
      title: 'Legal & Staff Administration',
      links: [
        { label: 'Terms of Use', route: { name: 'page', slug: 'terms' } },
        { label: 'Privacy Policy', route: { name: 'page', slug: 'privacy' } },
        { label: 'Claims Policy', route: { name: 'page', slug: 'claims-policy' } },
        { label: 'Anti-Social Forces Policy', route: { name: 'page', slug: 'anti-social-policy' } },
        { label: 'Security Export Control', route: { name: 'page', slug: 'security-export-control' } },
      ],
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="pb-5 border-b border-slate-200">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <button
            type="button"
            onClick={() => onNavigate({ name: 'home' })}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-medium text-slate-900">Sitemap</span>
        </nav>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          Pjs Venture Portal Sitemap
        </h1>
        <p className="text-sm text-slate-600 mt-1.5">
          Complete directory of inventory, shipping, verification, corporate, and compliance pages.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((grp) => (
          <div
            key={grp.title}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
          >
            <h2 className="font-display text-sm font-bold text-slate-950 pb-2 border-b border-slate-200">
              {grp.title}
            </h2>
            <ul className="space-y-2 text-xs text-slate-600">
              {grp.links.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className="hover:text-[#B91C1C] hover:underline text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

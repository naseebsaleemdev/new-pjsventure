import { ChevronRight } from 'lucide-react';
import { FooterPageSlug, PageRoute } from '../types/vehicle';

export type PolicyPageSlug = Extract<
  FooterPageSlug,
  | 'why-choose-us'
  | 'global-protection'
  | 'about'
  | 'company-profile'
  | 'csr-policy'
  | 'terms'
  | 'privacy'
  | 'claims-policy'
  | 'anti-social-policy'
  | 'security-export-control'
>;

interface PolicySection {
  heading: string;
  paragraphs: string[];
}

interface PolicyPageContent {
  crumb: string;
  title: string;
  subtitle: string;
  keyFacts?: { label: string; value: string }[];
  sections: PolicySection[];
}

const POLICY_PAGES: Record<PolicyPageSlug, PolicyPageContent> = {
  'why-choose-us': {
    crumb: 'Why Choose Pjs Venture',
    title: 'Why Global Buyers Choose Pjs Venture',
    subtitle:
      'Direct access to 120+ Japanese auto auctions, verified JEVIC/JAAI yard stock, and flexible Port Balance settlement terms.',
    keyFacts: [
      { label: 'Export Ports', value: 'Yokohama, Nagoya, Kobe, Hakata, Osaka' },
      { label: 'Inspection Partners', value: 'JEVIC · JAAI · QISJ Certified' },
      { label: 'Settlement Options', value: 'FOB / CIF TT Wire & Port Balance' },
      { label: 'Response SLA', value: 'Under 2 Business Hours' },
    ],
    sections: [
      {
        heading: '1. Direct Japanese Yard & Auction Pricing',
        paragraphs: [
          'Every vehicle listed in our catalog is owned or directly allocated at our Yokohama, Nagoya, Kobe, Osaka, and Hakata yards—eliminating layered middleman markups.',
          'Buyers requesting custom vehicles receive direct bidding representation across USS Tokyo, USS Nagoya, TAA, HAA Kobe, and JU auctions with translated inspection sheets before any bid is placed.',
        ],
      },
      {
        heading: '2. Port Balance Flexibility on Select Arrivals',
        paragraphs: [
          'Dealerships and private buyers importing to Mombasa, Dar es Salaam, Karachi Port Qasim, and Jebel Ali can reserve incoming or port-arrived inventory with a Booking Deposit and settle the remaining Port Balance at destination.',
        ],
      },
      {
        heading: '3. Full Paperwork & DHL Courier Guarantee',
        paragraphs: [
          'All exports ship with verified Japanese Export Certificates (Yushutsu Massho), official English translations, mandatory pre-shipment inspection certificates, and tracked DHL delivery of Original Bills of Lading.',
        ],
      },
    ],
  },
  'global-protection': {
    crumb: 'Global Protection Program',
    title: 'Global Protection Program',
    subtitle:
      'Pre-shipment mechanical verification, certified odometer integrity, and marine transit insurance coverage.',
    keyFacts: [
      { label: 'Odometer Guarantee', value: 'JEVIC / JAAI / Auction Sheet Verified' },
      { label: 'Transit Insurance', value: 'All-Risk Marine Cargo Coverage' },
      { label: 'Yard Security', value: '24/7 CCTV Export Compound Handling' },
      { label: 'Claims Window', value: '7 Calendar Days Post-Arrival' },
    ],
    sections: [
      {
        heading: 'Pre-Shipment Mechanical & Odometer Verification',
        paragraphs: [
          'Prior to booking space on any Ro-Ro vessel or 20ft container, Pjs Venture technicians verify engine compression, hybrid battery state-of-health, air conditioning, and chassis stamp numbers against deregistration records.',
        ],
      },
      {
        heading: 'Marine Cargo Transit Protection',
        paragraphs: [
          'Orders placed with CIF + Marine Insurance coverage are insured from Japanese export terminal loading until vessel discharge at the destination port listed on the Bill of Lading.',
        ],
      },
    ],
  },
  about: {
    crumb: 'Our Company',
    title: 'About Pjs Venture Co., Ltd.',
    subtitle:
      'Headquartered at Daikoku-futo Export Terminal in Yokohama, exporting quality Japanese vehicles to Africa, the Caribbean, South Asia, and the Middle East.',
    sections: [
      {
        heading: 'Direct Japanese Automotive Exporter',
        paragraphs: [
          'Pjs Venture Co., Ltd. connects international dealerships, fleet operators, and individual buyers directly with verified Japanese domestic inventory.',
          'Our multilingual export coordinators oversee auction procurement, inland transport, JEVIC/JAAI inspection, marine vessel booking, and destination Port Balance settlements.',
        ],
      },
      {
        heading: 'Five Strategic Japanese Departure Yards',
        paragraphs: [
          'Operating active stock yards near Yokohama, Nagoya, Kobe, Osaka, and Hakata enables fast vessel turnaround to Mombasa, Dar es Salaam, Durban, Kingston, Port Qasim, Colombo, and Jebel Ali.',
        ],
      },
    ],
  },
  'company-profile': {
    crumb: 'Company Profile',
    title: 'Corporate Company Profile',
    subtitle:
      'Official corporate registration, export yard infrastructure, and trade association details for Pjs Venture Co., Ltd.',
    keyFacts: [
      { label: 'Legal Entity', value: 'Pjs Venture Co., Ltd.' },
      { label: 'Headquarters', value: 'Daikoku-futo Export Terminal, Tsurumi-ku, Yokohama' },
      { label: 'Industry Association', value: 'JUMVEA Member (Japan Used Motor Vehicle Exporters)' },
      { label: 'Primary Business', value: 'Direct Used Car, Commercial Van & Truck Export' },
    ],
    sections: [
      {
        heading: 'Operational Capabilities',
        paragraphs: [
          'Pjs Venture maintains licensed bidding memberships across all major Japanese auto auction groups (USS, TAA, HAA, JU, CAA) as well as ready-to-ship yard inventory and Port Balance allocations.',
          'Corporate banking and Proforma Invoice settlements operate transparently under Japanese commercial law with dedicated consignee documentation support.',
        ],
      },
    ],
  },
  'csr-policy': {
    crumb: 'CSR Policy',
    title: 'Corporate Social Responsibility (CSR) Policy',
    subtitle:
      'Promoting fuel-efficient hybrid mobility, environmental compliance, and transparent cross-border automotive trade.',
    sections: [
      {
        heading: 'Environmental Stewardship & Hybrid Exports',
        paragraphs: [
          'Pjs Venture prioritizes low-emission petrol, Euro-compliant diesel, and high-efficiency hybrid vehicles while adhering strictly to Japan End-of-Life Vehicle Recycling regulations.',
        ],
      },
      {
        heading: 'Transparent Disclosure & Fair Trade',
        paragraphs: [
          'We commit to honest mechanical representation, publishing unaltered auction grades and exterior/interior ratings so international buyers make informed purchasing decisions.',
        ],
      },
    ],
  },
  terms: {
    crumb: 'Terms of Use',
    title: 'Terms of Use & Export Sales Conditions',
    subtitle:
      'Standard commercial terms governing vehicle reservations, Proforma Invoices, wire settlements, and export shipping.',
    sections: [
      {
        heading: '1. Reservations & Proforma Invoices',
        paragraphs: [
          'All inventory is subject to prior sale until a signed Proforma Invoice (PI) is issued and the agreed booking deposit or full TT wire payment is received within 72 business hours.',
        ],
      },
      {
        heading: '2. Destination Import Eligibility',
        paragraphs: [
          'Buyers are responsible for confirming destination country age-limit rules, emissions requirements, and right-hand or left-hand drive registration regulations prior to confirming shipment.',
        ],
      },
    ],
  },
  privacy: {
    crumb: 'Privacy Policy',
    title: 'Privacy Policy',
    subtitle:
      'How Pjs Venture Co., Ltd. handles consignee records, inquiry forms, and shipping documentation.',
    sections: [
      {
        heading: 'Data Usage & Documentation',
        paragraphs: [
          'Buyer names, company details, consignee addresses, email addresses, and WhatsApp numbers submitted through quote or auction forms are used exclusively to prepare Proforma Invoices, Bills of Lading, and DHL shipping notifications.',
        ],
      },
      {
        heading: 'Confidentiality',
        paragraphs: [
          'We do not sell, rent, or disclose buyer contact details or purchase pricing records to unrelated third parties outside mandatory customs, inspection, and shipping line authorities.',
        ],
      },
    ],
  },
  'claims-policy': {
    crumb: 'Claims Policy',
    title: 'Post-Arrival Claims & Resolution Policy',
    subtitle:
      'Structured review process for resolving verified discrepancies upon destination port discharge.',
    sections: [
      {
        heading: 'Submission Window & Evidence',
        paragraphs: [
          'Any claim concerning verified odometer integrity or undisclosed major mechanical damage must be reported within 7 calendar days of vessel arrival at the destination port, supported by timestamped port discharge photos and an authorized workshop report.',
        ],
      },
      {
        heading: 'Audit Against Pre-Shipment Records',
        paragraphs: [
          'Claims are evaluated objectively against the original auction inspection sheet, pre-shipment yard photographs, and JEVIC/JAAI certificate issued prior to loading.',
        ],
      },
    ],
  },
  'anti-social-policy': {
    crumb: 'Basic Policy Against Anti-Social Forces',
    title: 'Basic Policy Against Anti-Social Forces',
    subtitle:
      'Pjs Venture Co., Ltd. corporate governance pledge against organized crime and illicit transactions.',
    sections: [
      {
        heading: 'Zero-Tolerance Corporate Governance',
        paragraphs: [
          'Pjs Venture Co., Ltd. refuses all business transactions, financial settlements, or intermediary relationships with any anti-social forces, crime syndicates, or sanctioned entities.',
          'All domestic auction acquisitions and international remittances undergo compliance verification in accordance with Japanese corporate ethics standards.',
        ],
      },
    ],
  },
  'security-export-control': {
    crumb: 'Security Export Control',
    title: 'Security Export Control Compliance',
    subtitle:
      'Compliance with Japan Foreign Exchange and Foreign Trade Act and METI export licensing rules.',
    sections: [
      {
        heading: 'Export Screening & Customs Clearance',
        paragraphs: [
          'Every vehicle, pickup, and commercial truck exported by Pjs Venture undergoes end-user screening, chassis deregistration verification, and Japan Customs export declaration through licensed port brokers.',
        ],
      },
    ],
  },
};

export function FooterPolicyPage({
  slug,
  onNavigate,
}: {
  slug: PolicyPageSlug;
  onNavigate: (route: PageRoute) => void;
}) {
  const content = POLICY_PAGES[slug];

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
          <span className="font-medium text-slate-900">{content.crumb}</span>
        </nav>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          {content.title}
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
          {content.subtitle}
        </p>
      </div>

      {content.keyFacts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.keyFacts.map((fact) => (
            <div
              key={fact.label}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <span className="text-xs text-slate-500 block">{fact.label}</span>
              <span className="font-display text-sm font-bold text-slate-950 mt-1 block">
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 max-w-4xl">
        {content.sections.map((sec) => (
          <section key={sec.heading} className="space-y-2.5">
            <h2 className="font-display text-lg font-bold text-slate-950">
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p, idx) => (
              <p key={idx} className="text-sm text-slate-700 leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}

        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate({ name: 'used-cars' })}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
          >
            Browse Used Cars Inventory
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'contact' })}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Contact Export Support
          </button>
        </div>
      </div>
    </div>
  );
}

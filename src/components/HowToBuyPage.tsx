import { ExportProcessSection } from './ExportProcessSection';
import { DestinationPort } from '../types/vehicle';

interface HowToBuyPageProps {
  selectedPort: DestinationPort;
  onSelectPort: (port: DestinationPort) => void;
  onBackToStock: () => void;
}

const FAQS = [
  {
    q: 'How do I pay for my vehicle from Japan?',
    a: 'Pjs Venture accepts Telegraphic Transfer (TT) bank wires to our verified corporate accounts in Yokohama, Japan (MUFG / SMBC), as well as Irrevocable Letters of Credit (L/C) for bulk dealership orders.',
  },
  {
    q: 'Are JEVIC, QISJ, and JAAI inspections included?',
    a: 'Yes. We arrange the mandatory pre-export inspection required by your destination country (such as KEBS QISJ for Kenya, TBS for Tanzania, or JEVIC for Jamaica, Sri Lanka, and Fiji) prior to vessel loading.',
  },
  {
    q: 'How long does shipping take from Japan?',
    a: 'Average vessel transit ranges from 14 days (Colombo) to 22–26 days (Mombasa / Dar es Salaam) and 28–34 days (Kingston / Southampton). Original documents are dispatched via DHL Express immediately after sailing.',
  },
  {
    q: 'Can I import a Left-Hand Drive (LHD) or commercial truck?',
    a: 'Yes. In addition to RHD Japanese domestic models, we source LHD export-spec trucks and SUVs from Yokohama and Kobe yards, shippable by Ro-Ro or 20ft/40ft container.',
  },
];

export function HowToBuyPage({
  selectedPort,
  onSelectPort,
  onBackToStock,
}: HowToBuyPageProps) {
  return (
    <div className="space-y-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#B91C1C]">
              Pjs Venture Export Buying Guide
            </p>
            <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              How to Import Vehicles Directly from Japan
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Every step from Proforma Invoice issuance and Telegraphic Transfer verification to pre-export inspection, Ro-Ro booking, and DHL Bill of Lading delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToStock}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Browse Ready Stock
          </button>
        </div>
      </div>

      <ExportProcessSection
        selectedPort={selectedPort}
        onSelectPort={(port) => {
          onSelectPort(port);
          onBackToStock();
        }}
      />

      {/* Export FAQ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-slate-950 mb-5">
            Frequently Asked Import Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQS.map((item) => (
              <div key={item.q} className="p-5 bg-[#F8F9FA] border border-slate-200 rounded-xl">
                <h3 className="font-display text-sm font-bold text-slate-950">
                  {item.q}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Search,
  Ship,
  ShieldCheck,
} from 'lucide-react';
import { PageRoute, Vehicle } from '../types/vehicle';

interface SupportPageProps {
  vehicles: Vehicle[];
  onNavigate: (route: PageRoute) => void;
  onInspectVehicle: (vehicle: Vehicle) => void;
}

interface ShipmentRecord {
  ref: string;
  vehicle: string;
  chassis: string;
  originPort: string;
  destinationPort: string;
  vessel: string;
  etd: string;
  eta: string;
  currentStage: number; // 0..4
  dhlTracking: string;
}

const SAMPLE_SHIPMENTS: ShipmentRecord[] = [
  {
    ref: 'PJV-1042',
    vehicle: '2022 Toyota Land Cruiser Prado TX-L',
    chassis: 'GDJ150W-019482',
    originPort: 'Yokohama Terminal',
    destinationPort: 'Mombasa, Kenya',
    vessel: 'MV Hoegh Tracer (Ro-Ro)',
    etd: '2026-11-18',
    eta: '2026-12-12',
    currentStage: 3,
    dhlTracking: 'DHL-JP-88412049',
  },
  {
    ref: 'PJV-1051',
    vehicle: '2020 Toyota Hiace Van 2.8D',
    chassis: 'GDH206V-004192',
    originPort: 'Hakata Port',
    destinationPort: 'Dar es Salaam, Tanzania',
    vessel: 'MV Morning Lily (Port Balance)',
    etd: '2026-10-29',
    eta: '2026-11-24 (Arrived)',
    currentStage: 4,
    dhlTracking: 'DHL-JP-88409112',
  },
  {
    ref: 'PJV-1064',
    vehicle: '2020 Toyota Prius S Safety Plus',
    chassis: 'ZVW51-6140293',
    originPort: 'Nagoya Yard',
    destinationPort: 'Mombasa, Kenya',
    vessel: 'MV Grand Orion (In Transit)',
    etd: '2026-11-10',
    eta: '2026-12-03',
    currentStage: 3,
    dhlTracking: 'DHL-JP-88410551',
  },
];

const SHIPMENT_STAGES = [
  'Auction / Yard Secured',
  'JEVIC / JAAI Inspection Passed',
  'Japan Export Customs Cleared',
  'Loaded Onboard Vessel',
  'Arrived at Port & B/L Couriered',
];

function BreadcrumbHeader({
  title,
  subtitle,
  crumb,
  onNavigate,
}: {
  title: string;
  subtitle: string;
  crumb: string;
  onNavigate: (route: PageRoute) => void;
}) {
  return (
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
        <span className="font-medium text-slate-900">{crumb}</span>
      </nav>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">{subtitle}</p>
    </div>
  );
}

export function CarTrackingPage({
  onNavigate,
}: Omit<SupportPageProps, 'vehicles' | 'onInspectVehicle'>) {
  const [query, setQuery] = useState('PJV-1042');
  const [activeRecord, setActiveRecord] = useState<ShipmentRecord | null>(
    SAMPLE_SHIPMENTS[0]
  );
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    const match = SAMPLE_SHIPMENTS.find(
      (s) =>
        s.ref.toLowerCase() === q ||
        s.chassis.toLowerCase() === q ||
        s.dhlTracking.toLowerCase() === q
    );
    if (match) {
      setActiveRecord(match);
      setNotFound(false);
    } else {
      setActiveRecord(null);
      setNotFound(true);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbHeader
        crumb="Car Tracking"
        title="Vehicle & Vessel Shipment Tracking"
        subtitle="Track Ro-Ro / Container vessel departures, JEVIC/JAAI inspection completion, and DHL Original Bill of Lading dispatch."
        onNavigate={onNavigate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-slate-950">
            Lookup by Stock No., Chassis, or DHL Reference
          </h2>
          <form onSubmit={handleTrack} className="space-y-3">
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. PJV-1042 or GDJ150W-019482"
                className="w-full pl-9 pr-3 py-2.5 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
            >
              Track Shipment Status
            </button>
          </form>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Active Sailing Samples
            </p>
            <div className="space-y-2">
              {SAMPLE_SHIPMENTS.map((s) => (
                <button
                  key={s.ref}
                  type="button"
                  onClick={() => {
                    setQuery(s.ref);
                    setActiveRecord(s);
                    setNotFound(false);
                  }}
                  className="w-full text-left p-2.5 bg-[#F8F9FA] hover:bg-slate-100 border border-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  <div className="flex justify-between font-mono font-semibold text-slate-900">
                    <span>{s.ref}</span>
                    <span>{s.destinationPort}</span>
                  </div>
                  <p className="text-slate-600 truncate mt-0.5">{s.vehicle}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {activeRecord ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="font-mono text-xs text-slate-500">
                    Booking Ref {activeRecord.ref} · Chassis {activeRecord.chassis}
                  </p>
                  <h2 className="font-display text-xl font-bold text-slate-950 mt-1">
                    {activeRecord.vehicle}
                  </h2>
                </div>
                <div className="text-right font-mono text-xs tabular-nums">
                  <p className="text-slate-500">Vessel</p>
                  <p className="font-semibold text-slate-950">{activeRecord.vessel}</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#F8F9FA] border border-slate-200 rounded-lg p-4">
                <div>
                  <dt className="text-slate-500">Origin Port</dt>
                  <dd className="font-semibold text-slate-950 mt-0.5">
                    {activeRecord.originPort}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Destination</dt>
                  <dd className="font-semibold text-slate-950 mt-0.5">
                    {activeRecord.destinationPort}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">ETD / ETA</dt>
                  <dd className="font-mono font-semibold text-slate-950 mt-0.5 tabular-nums">
                    {activeRecord.etd} → {activeRecord.eta}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">DHL B/L Tracking</dt>
                  <dd className="font-mono font-semibold text-[#B91C1C] mt-0.5">
                    {activeRecord.dhlTracking}
                  </dd>
                </div>
              </dl>

              <div className="space-y-3">
                <h3 className="font-display text-sm font-bold text-slate-950">
                  Export Milestone Progress
                </h3>
                <ol className="space-y-2.5">
                  {SHIPMENT_STAGES.map((stage, idx) => {
                    const done = idx <= activeRecord.currentStage;
                    return (
                      <li
                        key={stage}
                        className="flex items-center gap-3 text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                      >
                        {done ? (
                          <CheckCircle2
                            className="w-4 h-4 text-emerald-700 shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <Ship
                            className="w-4 h-4 text-slate-400 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={
                            done
                              ? 'font-semibold text-slate-950'
                              : 'text-slate-500'
                          }
                        >
                          {idx + 1}. {stage}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <p className="font-display text-base font-bold text-slate-900">
                {notFound
                  ? 'No active booking matched that reference'
                  : 'Enter a reference number to inspect shipping progress'}
              </p>
              <p className="text-xs text-slate-600">
                Need your assigned vessel B/L number or container seal status? Reach our Yokohama documentation desk directly.
              </p>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'contact' })}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
              >
                Contact Documentation Desk
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CHASSIS_PREFIX_DB: {
  prefix: string;
  model: string;
  years: string;
  engine: string;
  fuel: string;
  drive: string;
}[] = [
  { prefix: 'GDJ150W', model: 'Toyota Land Cruiser Prado', years: '2015–2023', engine: '2,754 cc 1GD-FTV', fuel: 'Diesel', drive: '4WD' },
  { prefix: 'AXUH80', model: 'Toyota Harrier Hybrid', years: '2020–2025', engine: '2,487 cc A25A-FXS', fuel: 'Hybrid', drive: '2WD / E-Four' },
  { prefix: 'GUN125', model: 'Toyota Hilux Double Cab', years: '2017–2025', engine: '2,393 cc 2GD-FTV', fuel: 'Diesel', drive: '4WD' },
  { prefix: 'AGH30W', model: 'Toyota Alphard 2.5L', years: '2015–2023', engine: '2,493 cc 2AR-FE', fuel: 'Petrol', drive: '2WD' },
  { prefix: 'RV5', model: 'Honda Vezel e:HEV', years: '2021–2025', engine: '1,496 cc LFB-H4', fuel: 'Hybrid', drive: '2WD / AWD' },
  { prefix: 'GDH206V', model: 'Toyota Hiace Van 2.8D', years: '2017–2025', engine: '2,754 cc 1GD-FTV', fuel: 'Diesel', drive: '4WD' },
  { prefix: 'ZVW51', model: 'Toyota Prius 1.8', years: '2015–2022', engine: '1,797 cc 2ZR-FXE', fuel: 'Hybrid', drive: '2WD' },
  { prefix: 'NSP130', model: 'Toyota Vitz 1.3', years: '2010–2020', engine: '1,329 cc 1NR-FE', fuel: 'Petrol', drive: '2WD' },
];

export function ChassisCheckPage({
  vehicles,
  onNavigate,
  onInspectVehicle,
}: SupportPageProps) {
  const [chassisInput, setChassisInput] = useState('GDJ150W-019482');

  const normalized = chassisInput.trim().toUpperCase();
  const matchedVehicle = vehicles.find(
    (v) =>
      v.chassisCode.toUpperCase() === normalized ||
      v.stockNo.toUpperCase() === normalized
  );
  const prefixMatch = CHASSIS_PREFIX_DB.find((item) =>
    normalized.startsWith(item.prefix)
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbHeader
        crumb="Chassis Check"
        title="Japanese Chassis / Frame Number Verification"
        subtitle="Verify manufacture period, chassis series code, and export eligibility against Japan deregistration and Pjs Venture stock records."
        onNavigate={onNavigate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-slate-950">
            Enter Japanese Chassis / Frame Code
          </h2>
          <input
            type="text"
            value={chassisInput}
            onChange={(e) => setChassisInput(e.target.value)}
            placeholder="e.g. GDJ150W-019482 or ZVW51"
            className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
          />

          <div className="flex flex-wrap gap-2">
            {vehicles.slice(0, 4).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setChassisInput(v.chassisCode)}
                className="px-2.5 py-1 text-[11px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer"
              >
                {v.chassisCode}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Every export vehicle includes an official Japanese Export Certificate (Yushutsu Massho) confirming exact registration month/year for customs age-limit rules.
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          {matchedVehicle ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="font-mono text-xs text-emerald-700 font-semibold">
                    Verified in Active Export Stock · {matchedVehicle.stockNo}
                  </span>
                  <h2 className="font-display text-xl font-bold text-slate-950 mt-0.5">
                    {matchedVehicle.year} {matchedVehicle.make} {matchedVehicle.model}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onInspectVehicle(matchedVehicle)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                >
                  Open Full Spec Page
                </button>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <dt className="text-slate-500">Chassis Code</dt>
                  <dd className="font-mono font-semibold text-slate-950 mt-0.5">
                    {matchedVehicle.chassisCode}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Reg. Year / Month</dt>
                  <dd className="font-mono font-semibold text-slate-950 mt-0.5 tabular-nums">
                    {matchedVehicle.year} / {String(matchedVehicle.month).padStart(2, '0')}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Inspection Agency</dt>
                  <dd className="font-semibold text-slate-950 mt-0.5">
                    {matchedVehicle.inspectionAgency} Certified
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Engine / Fuel</dt>
                  <dd className="font-mono font-semibold text-slate-950 mt-0.5">
                    {matchedVehicle.engineCc} cc · {matchedVehicle.fuel}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Verified Odometer</dt>
                  <dd className="font-mono font-semibold text-slate-950 mt-0.5 tabular-nums">
                    {matchedVehicle.mileageKm.toLocaleString()} km
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Yard / Port</dt>
                  <dd className="font-semibold text-slate-950 mt-0.5">
                    {matchedVehicle.portBalancePort || `${matchedVehicle.yardPort}, Japan`}
                  </dd>
                </div>
              </dl>
            </div>
          ) : prefixMatch ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <span className="font-mono text-xs text-slate-500">
                Japanese Chassis Model Match · {prefixMatch.prefix}
              </span>
              <h2 className="font-display text-xl font-bold text-slate-950">
                {prefixMatch.model}
              </h2>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-200">
                <div>
                  <dt className="text-slate-500">Production Years</dt>
                  <dd className="font-mono font-semibold text-slate-950">{prefixMatch.years}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Engine</dt>
                  <dd className="font-mono font-semibold text-slate-950">{prefixMatch.engine}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Fuel</dt>
                  <dd className="font-semibold text-slate-950">{prefixMatch.fuel}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Drivetrain</dt>
                  <dd className="font-semibold text-slate-950">{prefixMatch.drive}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <p className="font-display text-base font-bold text-slate-900">
                Custom Chassis Verification Available
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Submit any Japanese frame number to our Yokohama desk for complimentary manufacture-month and age-limit verification before purchase.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const HELP_FAQS = [
  {
    category: 'Purchasing & Proforma Invoice',
    q: 'How do I reserve a vehicle and get an official Proforma Invoice?',
    a: 'Select any vehicle from Used Cars, verify your Destination Port and CIF total, and click Inquire Now or submit Step 2 on the vehicle page. Our Yokohama sales team issues an official Proforma Invoice (PI) valid for 72 business hours.',
  },
  {
    category: 'Port Balance Terms',
    q: 'How do Port Balance cars work?',
    a: 'Port Balance units are already shipped or arriving at designated destination ports (such as Dar es Salaam, Mombasa, Karachi Port Qasim, or Jebel Ali). You pay a Booking Deposit upfront to lock the unit and settle the remaining Port Balance upon arrival/clearance.',
  },
  {
    category: 'Payment & TT Wire',
    q: 'What payment methods does Pjs Venture accept?',
    a: 'All exports settle via Telegraphic Transfer (TT Bank Wire) directly to Pjs Venture Co., Ltd. corporate accounts in Japan, or via irrevocable Letter of Credit (L/C) for approved dealership bulk orders.',
  },
  {
    category: 'Inspections & Odometers',
    q: 'Are odometers and radiation levels certified prior to loading?',
    a: 'Yes. Every vehicle is inspected by JEVIC, JAAI, or QISJ as mandated by your destination port customs authority before Ro-Ro or 20ft container loading.',
  },
  {
    category: 'Shipping & Documentation',
    q: 'When will I receive the Bill of Lading (B/L) and Export Certificate?',
    a: 'Once full payment clears and the vessel departs Japan, original documents (B/L, Japanese Export Certificate + English translation, Inspection Certificate, and Commercial Invoice) are dispatched via DHL courier within 5–7 business days.',
  },
];

export function HelpCenterPage({
  onNavigate,
}: Omit<SupportPageProps, 'vehicles' | 'onInspectVehicle'>) {
  const [filterText, setFilterText] = useState('');

  const filteredFaqs = HELP_FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(filterText.toLowerCase()) ||
      f.a.toLowerCase().includes(filterText.toLowerCase()) ||
      f.category.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbHeader
        crumb="Help Center"
        title="Importer Help Center & Export FAQ"
        subtitle="Answers covering vehicle reservations, Proforma Invoices, Port Balance settlement, JEVIC/JAAI inspections, and DHL shipping documents."
        onNavigate={onNavigate}
      />

      <div className="max-w-xl">
        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search FAQ topics (e.g. Port Balance, TT wire, JEVIC, DHL)..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFaqs.map((item) => (
          <div
            key={item.q}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-2"
          >
            <span className="font-mono text-[11px] font-semibold text-[#B91C1C]">
              {item.category}
            </span>
            <h2 className="font-display text-base font-bold text-slate-950">
              {item.q}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-slate-950">
            Still have a question for our Yokohama export team?
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Direct assistance for customs age limits, Ro-Ro bookings, and fleet quotes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate({ name: 'contact' })}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
        >
          Contact Support Desk
        </button>
      </div>
    </div>
  );
}

const AUCTION_GRADES = [
  { grade: 'S / 6', meaning: 'Brand new / delivery mileage under 10,000 km with virtually zero wear.' },
  { grade: '5', meaning: 'Near-new condition, under 50,000 km, original factory paint and clean interior.' },
  { grade: '4.5', meaning: 'Excellent condition with only minor hairline scuffs or tiny pin-dents.' },
  { grade: '4', meaning: 'Above-average clean used car with normal light wear for its age.' },
  { grade: '3.5', meaning: 'Good mechanical condition with visible exterior blemishes or minor panel repair.' },
  { grade: 'R / RA', meaning: 'Replaced bolt-on panel or repaired light accident history; fully disclosed.' },
];

const DAMAGE_CODES = [
  { code: 'A1 / A2 / A3', desc: 'Scratch severity (1 = faint hairline, 2 = light scratch, 3 = noticeable scratch)' },
  { code: 'U1 / U2 / U3', desc: 'Minor dent severity (1 = thumb-sized pin dent, 3 = larger shallow dent)' },
  { code: 'W1 / W2 / W3', desc: 'Panel repainted / wave marks (1 = nearly invisible professional repaint)' },
  { code: 'S1 / S2', desc: 'Surface rust spots (1 = minor surface spot, 2 = moderate corrosion)' },
  { code: 'X / XX', desc: 'Panel requires replacement (X) or has already been replaced (XX)' },
  { code: 'B1 / B2', desc: 'Dent accompanied by paint scratch' },
];

export function ConditionReportPage({
  onNavigate,
}: Omit<SupportPageProps, 'vehicles' | 'onInspectVehicle'>) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbHeader
        crumb="Damage Condition Report"
        title="Auction Sheet & Damage Condition Guide"
        subtitle="Understand Japanese USS, TAA, and HAA exterior grades, interior ratings, and inspector body-diagram defect codes."
        onNavigate={onNavigate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-[#0F172A] text-white">
            <h2 className="font-display text-base font-bold">
              Overall Auction Grade Scale
            </h2>
          </div>
          <div className="divide-y divide-slate-200 text-xs">
            {AUCTION_GRADES.map((g) => (
              <div key={g.grade} className="p-4 flex items-start gap-4">
                <span className="font-mono font-bold text-sm text-[#B91C1C] w-16 shrink-0">
                  Grade {g.grade}
                </span>
                <p className="text-slate-700 leading-relaxed">{g.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-[#0F172A] text-white">
            <h2 className="font-display text-base font-bold">
              Body Diagram Defect Symbols
            </h2>
          </div>
          <div className="divide-y divide-slate-200 text-xs">
            {DAMAGE_CODES.map((d) => (
              <div key={d.code} className="p-4 flex items-start gap-4">
                <span className="font-mono font-bold text-sm text-slate-950 w-24 shrink-0">
                  {d.code}
                </span>
                <p className="text-slate-700 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-700">
          Want a translated English inspection sheet before bidding at live Japanese auctions?
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ name: 'auction' })}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
        >
          Request Auction Sheet Translation
        </button>
      </div>
    </div>
  );
}

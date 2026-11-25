import { useEffect, useState, type FormEvent } from 'react';
import {
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Expand,
  GitCompareArrows,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';
import { calculateVehicleCif, DESTINATION_PORTS } from '../data/ports';
import {
  DestinationPort,
  PortalQuery,
  ShippingMethod,
  Vehicle,
} from '../types/vehicle';

interface VehicleSinglePageProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
  selectedPort: DestinationPort;
  shippingMethod: ShippingMethod;
  includeInsurance: boolean;
  isInInquiry: boolean;
  isInCompare: boolean;
  onChangePort: (port: DestinationPort) => void;
  onChangeShippingMethod: (method: ShippingMethod) => void;
  onChangeInsurance: (include: boolean) => void;
  onToggleInquiry: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onSubmitDirectQuery: (
    query: Omit<PortalQuery, 'id' | 'referenceId' | 'status' | 'createdAt'>
  ) => PortalQuery;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onInspectChassis?: (chassisCode: string) => void;
  onFilterMake?: (make: string) => void;
  onGoHome?: () => void;
  onBackToStock: () => void;
}

const STANDARD_EQUIPMENT = [
  'Power Steering',
  'Air Conditioning',
  'Anti-Lock Braking (ABS)',
  'Dual SRS Airbags',
  'Power Windows',
  'Central Locking',
];

export function VehicleSinglePage({
  vehicle,
  allVehicles,
  selectedPort,
  shippingMethod,
  includeInsurance,
  isInInquiry,
  isInCompare,
  onChangePort,
  onChangeShippingMethod,
  onChangeInsurance,
  onToggleInquiry,
  onToggleCompare,
  onSubmitDirectQuery,
  onSelectVehicle,
  onInspectChassis,
  onFilterMake,
  onGoHome,
  onBackToStock,
}: VehicleSinglePageProps) {
  const gallery =
    vehicle.galleryImages && vehicle.galleryImages.length > 0
      ? vehicle.galleryImages
      : [vehicle.imageUrl];

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Direct Inquiry Form State
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<PortalQuery | null>(null);

  useEffect(() => {
    setActivePhotoIndex(0);
    setImgError(false);
    setIsLightboxOpen(false);
    setSubmittedQuery(null);
  }, [vehicle.id]);

  const activePhotoUrl = gallery[activePhotoIndex] || vehicle.imageUrl;

  const cif = calculateVehicleCif(
    vehicle,
    selectedPort,
    shippingMethod,
    includeInsurance
  );

  const isPortBalance =
    vehicle.availability === 'Port Balance' &&
    Boolean(vehicle.portBalancePort) &&
    Boolean(vehicle.depositUsd) &&
    Boolean(vehicle.portBalanceUsd);

  const combinedEquipment = Array.from(
    new Set([...vehicle.features, ...STANDARD_EQUIPMENT])
  );

  const relatedVehicles = allVehicles
    .filter(
      (v) =>
        v.id !== vehicle.id &&
        (v.make === vehicle.make || v.bodyType === vehicle.bodyType)
    )
    .slice(0, 4);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !email.trim() || !phoneWhatsApp.trim()) return;

    const created = onSubmitDirectQuery({
      type: 'Vehicle Inquiry',
      buyerName: buyerName.trim(),
      companyName: companyName.trim() || 'Private Importer',
      email: email.trim(),
      phoneWhatsApp: phoneWhatsApp.trim(),
      destinationPort: `${selectedPort.portName}, ${selectedPort.country}`,
      shippingMethod,
      subject: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockNo})`,
      vehicleRefs: [vehicle.stockNo],
      estimatedCifUsd: cif.totalCifUsd,
      notes:
        notes.trim() ||
        `Requesting official Proforma Invoice and ${vehicle.inspectionAgency} inspection schedule for ${vehicle.stockNo}.`,
    });

    setSubmittedQuery(created);
  };

  // SBT-style paired specification rows
  const specRows: { labelA: string; valA: string; labelB: string; valB: string }[] = [
    {
      labelA: 'Ref No. / Stock ID',
      valA: vehicle.stockNo,
      labelB: 'Chassis / Frame No.',
      valB: vehicle.chassisCode,
    },
    {
      labelA: 'Reg. Year / Month',
      valA: `${vehicle.year} / ${String(vehicle.month).padStart(2, '0')}`,
      labelB: 'Mileage',
      valB: `${vehicle.mileageKm.toLocaleString()} km`,
    },
    {
      labelA: 'Engine Capacity',
      valA: `${vehicle.engineCc.toLocaleString()} cc`,
      labelB: 'Fuel Type',
      valB: vehicle.fuel,
    },
    {
      labelA: 'Transmission',
      valA: vehicle.transmission,
      labelB: 'Drivetrain',
      valB: vehicle.drive,
    },
    {
      labelA: 'Steering',
      valA: vehicle.steering,
      labelB: 'Body Style',
      valB: vehicle.bodyType,
    },
    {
      labelA: 'Doors / Seats',
      valA: `${vehicle.doors} Doors / ${vehicle.seats} Seats`,
      labelB: 'Exterior Color',
      valB: vehicle.color,
    },
    {
      labelA: 'Shipping Volume',
      valA: `${vehicle.m3Volume} m³`,
      labelB: 'Japan Export Yard',
      valB: `${vehicle.yardPort} Port`,
    },
    {
      labelA: 'Auction Grade',
      valA: `Grade ${vehicle.auctionGrade} (Ext ${vehicle.exteriorGrade} / Int ${vehicle.interiorGrade})`,
      labelB: 'Inspection Agency',
      valB: `${vehicle.inspectionAgency} Verified`,
    },
    {
      labelA: 'Availability',
      valA: vehicle.availability,
      labelB: 'Stock Location',
      valB: isPortBalance
        ? `${vehicle.stockLocation || 'Port Balance'} (${vehicle.portBalancePort})`
        : `${vehicle.yardPort} Yard, Japan`,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* SBT-Style Breadcrumb & Utility Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <button
            type="button"
            onClick={onGoHome || onBackToStock}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <button
            type="button"
            onClick={onBackToStock}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            Used Cars
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <button
            type="button"
            onClick={() => {
              if (onFilterMake) {
                onFilterMake(vehicle.make);
              } else {
                onBackToStock();
              }
            }}
            className="hover:text-[#B91C1C] hover:underline cursor-pointer"
          >
            {vehicle.make}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="text-slate-700">{vehicle.model}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-mono font-semibold text-slate-950">{vehicle.stockNo}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {onInspectChassis && (
            <button
              type="button"
              onClick={() => onInspectChassis(vehicle.chassisCode)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              VIN &amp; Chassis Report
            </button>
          )}
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Link</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onToggleCompare(vehicle)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg cursor-pointer ${
              isInCompare
                ? 'bg-[#B91C1C]/10 text-[#B91C1C] border-[#B91C1C]'
                : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'
            }`}
          >
            <GitCompareArrows className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isInCompare ? 'Added to Compare' : 'Compare'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* SBT Vehicle Headline Banner */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span>
              Stock No.: <strong className="font-mono text-slate-950">{vehicle.stockNo}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Chassis: <strong className="font-mono text-slate-950">{vehicle.chassisCode}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Location:{' '}
              <strong className="text-slate-950">
                {isPortBalance
                  ? `${vehicle.portBalancePort} (${vehicle.stockLocation})`
                  : `${vehicle.yardPort} Yard, Japan`}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Grade <strong className="font-mono text-slate-950">{vehicle.auctionGrade}</strong> ({vehicle.exteriorGrade}/{vehicle.interiorGrade})
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div>
            <span className="block text-[11px] text-slate-500">FOB Price</span>
            <span className="font-mono text-2xl font-bold text-slate-950 tabular-nums">
              ${vehicle.fobUsd.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-slate-500">
              {isPortBalance ? `Port Balance (${vehicle.portBalancePort})` : `Total CIF (${selectedPort.portName})`}
            </span>
            <span className="font-mono text-2xl font-bold text-[#B91C1C] tabular-nums">
              $
              {(isPortBalance && vehicle.depositUsd && vehicle.portBalanceUsd
                ? vehicle.depositUsd + vehicle.portBalanceUsd
                : cif.totalCifUsd
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column SBT Detailed Vehicle Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Photo Viewer, Full Specs Table, Options Matrix & Inspector Note */}
        <div className="lg:col-span-7 space-y-6">
          {/* A. Multi-Photo Viewer + Thumbnail Strip */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="relative aspect-[4/3] w-full bg-slate-100">
              {!imgError ? (
                <img
                  src={activePhotoUrl}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} photo ${activePhotoIndex + 1}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full h-full object-cover cursor-zoom-in"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-8">
                  <Car className="w-12 h-12 mb-2 text-slate-400" aria-hidden="true" />
                  <p className="font-display font-semibold text-slate-700">
                    {vehicle.make} {vehicle.model}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Enlarge vehicle photo"
                className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/75 hover:bg-slate-950 text-white text-xs font-medium cursor-pointer"
              >
                <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Zoom</span>
              </button>

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous vehicle photo"
                    onClick={() => {
                      setImgError(false);
                      setActivePhotoIndex(
                        (prev) => (prev - 1 + gallery.length) % gallery.length
                      );
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next vehicle photo"
                    onClick={() => {
                      setImgError(false);
                      setActivePhotoIndex((prev) => (prev + 1) % gallery.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-slate-950/75 text-white font-mono text-[11px] tabular-nums">
                Photo {activePhotoIndex + 1} / {gallery.length}
              </span>
            </div>

            {gallery.length > 1 && (
              <div className="p-3 bg-[#F8F9FA] border-t border-slate-200 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {gallery.map((url, idx) => (
                  <button
                    key={`${url}-${idx}`}
                    type="button"
                    onClick={() => {
                      setImgError(false);
                      setActivePhotoIndex(idx);
                    }}
                    className={`relative aspect-[4/3] rounded-md overflow-hidden border-2 cursor-pointer ${
                      idx === activePhotoIndex
                        ? 'border-[#B91C1C]'
                        : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* B. SBT-Style Striped 4-Column Vehicle Specifications Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 bg-[#0F172A] text-white flex items-center justify-between">
              <h2 className="font-display text-base font-bold">
                Vehicle Specifications
              </h2>
              <span className="font-mono text-xs text-slate-300">
                Stock No. {vehicle.stockNo}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <tbody>
                  {specRows.map((row, idx) => (
                    <tr
                      key={row.labelA}
                      className={`border-b border-slate-200 last:border-b-0 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'
                      }`}
                    >
                      <th className="py-2.5 px-4 font-medium text-slate-500 bg-slate-50/70 w-[22%] border-r border-slate-200">
                        {row.labelA}
                      </th>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-900 w-[28%] border-r border-slate-200 tabular-nums">
                        {row.valA}
                      </td>
                      <th className="py-2.5 px-4 font-medium text-slate-500 bg-slate-50/70 w-[22%] border-r border-slate-200">
                        {row.labelB}
                      </th>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-900 w-[28%] tabular-nums">
                        {row.valB}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* C. Equipment & Features Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-slate-950 pb-2.5 border-b border-slate-200">
              Standard &amp; Equipped Options
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-800">
              {combinedEquipment.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-2 py-1.5 px-2.5 bg-[#F8F9FA] border border-slate-200/80 rounded-md"
                >
                  <Check className="w-3.5 h-3.5 text-[#B91C1C] shrink-0" aria-hidden="true" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* D. Auction Sheet & Yard Inspector Report */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
              <h2 className="font-display text-base font-bold text-slate-950">
                Yard Inspector Assessment &amp; Export Documents
              </h2>
              <span className="font-mono text-xs text-slate-700 tabular-nums">
                Grade {vehicle.auctionGrade} · Ext {vehicle.exteriorGrade} · Int {vehicle.interiorGrade}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {vehicle.inspectorNote}
            </p>
            <p className="text-xs text-slate-500 pt-1">
              Includes verified Export Certificate (Yushutsu Massho), {vehicle.inspectionAgency} pre-shipment odometer/radiation inspection, and Bill of Lading via DHL courier.
            </p>
          </div>
        </div>

        {/* Right Sticky Sidebar: SBT Price Calculator + Direct Inquiry Form */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5">
          {/* Step 1: Total Price Calculator */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 bg-[#0F172A] text-white flex items-center justify-between">
              <h2 className="font-display text-sm font-bold">
                Step 1. Calculate Total CIF Price
              </h2>
              <span className="font-mono text-xs text-slate-300 tabular-nums">
                {vehicle.m3Volume} m³
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label
                  htmlFor="single-port-select"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Destination Country / Port
                </label>
                <select
                  id="single-port-select"
                  value={selectedPort.id}
                  onChange={(e) => {
                    const found = DESTINATION_PORTS.find((p) => p.id === e.target.value);
                    if (found) onChangePort(found);
                  }}
                  className="w-full px-3 py-2 text-xs font-medium bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
                >
                  {DESTINATION_PORTS.map((port) => (
                    <option key={port.id} value={port.id}>
                      {port.country} — {port.portName} ({port.transitDays})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                {(['Ro-Ro Vessel', 'Container (20ft)'] as ShippingMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => onChangeShippingMethod(method)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      shippingMethod === method
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <label className="flex items-start gap-2.5 p-2.5 bg-[#F8F9FA] border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInsurance}
                  onChange={(e) => onChangeInsurance(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#B91C1C] cursor-pointer"
                />
                <span className="text-xs text-slate-700">
                  Marine Transit Insurance + {selectedPort.mandatoryInspection}
                </span>
              </label>

              {/* Itemized Price Breakdown Table */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>FOB Price ({vehicle.yardPort})</span>
                  <span className="font-mono tabular-nums">${cif.fobUsd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ocean Freight ({shippingMethod})</span>
                  <span className="font-mono tabular-nums">${cif.freightUsd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{vehicle.inspectionAgency} Inspection Fee</span>
                  <span className="font-mono tabular-nums">${cif.inspectionFeeUsd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Marine Insurance</span>
                  <span className="font-mono tabular-nums">${cif.insuranceUsd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 mt-2 border-t border-slate-200">
                  <span className="font-display font-bold text-slate-950">
                    Total CIF ({selectedPort.portName})
                  </span>
                  <span className="font-mono text-xl font-bold text-[#B91C1C] tabular-nums">
                    ${cif.totalCifUsd.toLocaleString()}
                  </span>
                </div>
              </div>

              {isPortBalance && vehicle.depositUsd && vehicle.portBalanceUsd && (
                <div className="p-3 bg-[#F8F9FA] border border-slate-200 rounded-lg space-y-1 text-xs">
                  <p className="font-display font-bold text-slate-950">
                    Port Balance Payment Option · {vehicle.portBalancePort}
                  </p>
                  <div className="flex justify-between text-slate-700">
                    <span>Booking Deposit</span>
                    <span className="font-mono font-semibold tabular-nums">
                      ${vehicle.depositUsd.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-950 font-semibold">
                    <span>Balance at Destination Port</span>
                    <span className="font-mono font-bold text-[#B91C1C] tabular-nums">
                      ${vehicle.portBalanceUsd.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => onToggleInquiry(vehicle)}
                className={`w-full py-2 px-4 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isInInquiry
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isInInquiry
                  ? 'Saved in Multi-Unit Inquiry List'
                  : '+ Add to Multi-Unit Inquiry List'}
              </button>
            </div>
          </div>

          {/* Step 2: Direct Free Quote & Reserve Form */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 bg-[#B91C1C] text-white">
              <h2 className="font-display text-sm font-bold">
                Step 2. Get Free Price Quote / Reserve Unit
              </h2>
              <p className="text-[11px] text-red-100 mt-0.5">
                Stock No. {vehicle.stockNo} · Proforma Invoice dispatched within 2 hrs
              </p>
            </div>

            <div className="p-5">
              {submittedQuery ? (
                <div className="p-4 bg-[#F8F9FA] border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-mono text-xs font-semibold text-emerald-800">
                        {submittedQuery.referenceId} — Quote Request Sent
                      </p>
                      <p className="text-sm font-semibold text-slate-950 mt-0.5">
                        Received by Yokohama Export Desk
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Your CIF quote for {vehicle.year} {vehicle.make} {vehicle.model} ({selectedPort.portName}: ${cif.totalCifUsd.toLocaleString()}) is logged for immediate response.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmittedQuery(null)}
                    className="text-xs font-semibold text-[#B91C1C] hover:underline cursor-pointer"
                  >
                    Submit another inquiry for this unit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="sp-name" className="block text-xs font-medium text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        id="sp-name"
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                      />
                    </div>
                    <div>
                      <label htmlFor="sp-company" className="block text-xs font-medium text-slate-700 mb-1">
                        Company / Dealership
                      </label>
                      <input
                        id="sp-company"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="sp-email" className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        id="sp-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="buyer@company.com"
                        className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                      />
                    </div>
                    <div>
                      <label htmlFor="sp-phone" className="block text-xs font-medium text-slate-700 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        id="sp-phone"
                        type="tel"
                        required
                        value={phoneWhatsApp}
                        onChange={(e) => setPhoneWhatsApp(e.target.value)}
                        placeholder="+254 / +92 / +971..."
                        className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sp-notes" className="block text-xs font-medium text-slate-700 mb-1">
                      Message / Consignee Instructions
                    </label>
                    <textarea
                      id="sp-notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Request auction sheet, undercarriage photos, or Proforma Invoice..."
                      className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors cursor-pointer"
                  >
                    Get Free Price Quote for {vehicle.stockNo}
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
                    <span>No obligation · Direct export coordinator response</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Stock Grid */}
      {relatedVehicles.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <h2 className="font-display text-xl font-bold text-slate-950 mb-5">
            Similar Vehicles in Export Stock
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedVehicles.map((rel) => {
              const relCif = calculateVehicleCif(
                rel,
                selectedPort,
                shippingMethod,
                includeInsurance
              );
              return (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onSelectVehicle(rel)}
                  className="text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full bg-slate-100">
                    <img
                      src={rel.imageUrl}
                      alt={`${rel.year} ${rel.make} ${rel.model}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[11px] text-slate-500">
                      {rel.stockNo} · {rel.yardPort} · Grade {rel.auctionGrade}
                    </p>
                    <h3 className="mt-1 font-display text-sm font-bold text-slate-950 truncate">
                      {rel.year} {rel.make} {rel.model}
                    </h3>
                    <div className="mt-2 flex items-baseline justify-between font-mono text-xs tabular-nums">
                      <span className="font-bold text-slate-950">
                        FOB ${rel.fobUsd.toLocaleString()}
                      </span>
                      <span className="font-semibold text-[#B91C1C]">
                        CIF ${relCif.totalCifUsd.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox Photo Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged vehicle photo"
          className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center p-4"
        >
          <div className="w-full max-w-5xl flex items-center justify-between text-white pb-3">
            <span className="font-mono text-xs tabular-nums">
              {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.stockNo}) · Photo {activePhotoIndex + 1} / {gallery.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close photo viewer"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative w-full max-w-5xl aspect-[4/3] max-h-[80vh] bg-black rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={activePhotoUrl}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} enlarged`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex(
                      (prev) => (prev - 1 + gallery.length) % gallery.length
                    )
                  }
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-black/60 hover:bg-black text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev + 1) % gallery.length)
                  }
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-black/60 hover:bg-black text-white cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

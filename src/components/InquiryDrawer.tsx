import { useState, type FormEvent } from 'react';
import { CheckCircle2, Copy, Trash2, X } from 'lucide-react';
import { calculateVehicleCif, DESTINATION_PORTS } from '../data/ports';
import { DestinationPort, InquirySubmission, PortalQuery, ShippingMethod, Vehicle } from '../types/vehicle';

interface InquiryDrawerProps {
  isOpen: boolean;
  vehicles: Vehicle[];
  selectedPort: DestinationPort;
  shippingMethod: ShippingMethod;
  includeInsurance: boolean;
  onChangePort: (port: DestinationPort) => void;
  onChangeShippingMethod: (method: ShippingMethod) => void;
  onRemoveVehicle: (vehicleId: string) => void;
  onClearVehicles: () => void;
  onSubmitProformaQuery: (
    query: Omit<PortalQuery, 'id' | 'referenceId' | 'status' | 'createdAt'>
  ) => PortalQuery;
  onClose: () => void;
}

export function InquiryDrawer({
  isOpen,
  vehicles,
  selectedPort,
  shippingMethod,
  includeInsurance,
  onChangePort,
  onChangeShippingMethod,
  onRemoveVehicle,
  onClearVehicles,
  onSubmitProformaQuery,
  onClose,
}: InquiryDrawerProps) {
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmed, setConfirmed] = useState<InquirySubmission | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totals = vehicles.reduce(
    (acc, v) => {
      const c = calculateVehicleCif(v, selectedPort, shippingMethod, includeInsurance);
      return {
        fob: acc.fob + c.fobUsd,
        freight: acc.freight + c.freightUsd,
        inspection: acc.inspection + c.inspectionFeeUsd,
        insurance: acc.insurance + c.insuranceUsd,
        cif: acc.cif + c.totalCifUsd,
      };
    },
    { fob: 0, freight: 0, inspection: 0, insurance: 0, cif: 0 }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (vehicles.length === 0) {
      setErrorMsg('Please add at least one vehicle to generate a Proforma Invoice.');
      return;
    }
    if (!buyerName.trim() || !email.trim() || !phoneWhatsApp.trim()) {
      setErrorMsg('Please complete your name, email address, and WhatsApp or phone number.');
      return;
    }

    setErrorMsg('');
    const createdQuery = onSubmitProformaQuery({
      type: 'Proforma Cart',
      buyerName: buyerName.trim(),
      companyName: companyName.trim() || 'Private Importer',
      email: email.trim(),
      phoneWhatsApp: phoneWhatsApp.trim(),
      destinationPort: `${selectedPort.portName}, ${selectedPort.country}`,
      shippingMethod,
      subject: `${vehicles.length} Unit${vehicles.length > 1 ? 's' : ''}: ${vehicles
        .map((v) => `${v.make} ${v.model}`)
        .join(' + ')}`,
      vehicleRefs: vehicles.map((v) => v.stockNo),
      estimatedCifUsd: totals.cif,
      notes: notes.trim() || 'Proforma Invoice requested via multi-unit inquiry cart.',
    });

    const submission: InquirySubmission = {
      referenceId: createdQuery.referenceId,
      buyerName: buyerName.trim(),
      companyName: companyName.trim() || 'Private Importer',
      email: email.trim(),
      phoneWhatsApp: phoneWhatsApp.trim(),
      port: selectedPort,
      shippingMethod,
      includeInsurance,
      vehicles: [...vehicles],
      totalFobUsd: totals.fob,
      totalFreightUsd: totals.freight + totals.inspection,
      totalInsuranceUsd: totals.insurance,
      totalCifUsd: totals.cif,
      notes: notes.trim(),
      submittedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setConfirmed(submission);
    onClearVehicles();
  };

  const handleCopySummary = () => {
    if (!confirmed) return;
    const lines = [
      `Pjs Venture — Proforma Invoice Request ${confirmed.referenceId}`,
      `Buyer: ${confirmed.buyerName} (${confirmed.companyName})`,
      `Destination: ${confirmed.port.portName}, ${confirmed.port.country} (${confirmed.shippingMethod})`,
      `Vehicles: ${confirmed.vehicles.map((v) => `${v.year} ${v.make} ${v.model} [${v.stockNo}]`).join('; ')}`,
      `Total Est. CIF: $${confirmed.totalCifUsd.toLocaleString()} USD`,
    ].join('\n');
    navigator.clipboard?.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartNew = () => {
    setConfirmed(null);
    setBuyerName('');
    setCompanyName('');
    setEmail('');
    setPhoneWhatsApp('');
    setNotes('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Proforma Invoice and Export Inquiry"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl border-l border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-950">
              Proforma Invoice &amp; Export Inquiry
            </h2>
            <p className="text-xs text-slate-500">
              Direct dispatch desk · Yokohama Head Office
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry drawer"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 flex-1 space-y-6">
          {confirmed ? (
            <div className="space-y-5">
              <div className="p-5 bg-[#F8F9FA] border border-slate-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-mono text-xs font-semibold text-emerald-800">
                      {confirmed.referenceId} — Proforma Request Confirmed
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-slate-950">
                      Thank you, {confirmed.buyerName}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      Our Yokohama export coordinator has reserved your vehicle selection for 48 hours and prepared your CIF Proforma Invoice for {confirmed.port.portName}, {confirmed.port.country}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference Number</span>
                  <span className="font-mono font-semibold text-slate-950">{confirmed.referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination Port</span>
                  <span className="font-medium text-slate-900">
                    {confirmed.port.portName}, {confirmed.port.country}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping Method</span>
                  <span className="font-medium text-slate-900">{confirmed.shippingMethod}</span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <span className="block text-xs font-semibold text-slate-500 mb-2">
                    Reserved Stock Units
                  </span>
                  <ul className="space-y-1.5">
                    {confirmed.vehicles.map((v) => (
                      <li key={v.id} className="flex justify-between text-xs">
                        <span className="text-slate-800 font-medium">
                          {v.year} {v.make} {v.model} ({v.stockNo})
                        </span>
                        <span className="font-mono text-slate-700 tabular-nums">
                          FOB ${v.fobUsd.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-semibold text-slate-950">Total Estimated CIF</span>
                  <span className="font-mono text-lg font-bold text-[#B91C1C] tabular-nums">
                    ${confirmed.totalCifUsd.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{copied ? 'Copied Reference' : 'Copy Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartNew}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Start New Inquiry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Selected Vehicles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-sm font-bold text-slate-950">
                    Selected Vehicles ({vehicles.length})
                  </h3>
                  {vehicles.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearVehicles}
                      className="text-xs font-medium text-slate-500 hover:text-[#B91C1C] cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {vehicles.length === 0 ? (
                  <div className="p-6 text-center bg-[#F8F9FA] border border-dashed border-slate-300 rounded-xl">
                    <p className="text-sm font-medium text-slate-700">
                      Your inquiry list is empty.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Select &ldquo;Add to Quote&rdquo; on any vehicle card to calculate combined shipping and request a Proforma Invoice.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {vehicles.map((v) => {
                      const c = calculateVehicleCif(v, selectedPort, shippingMethod, includeInsurance);
                      return (
                        <li
                          key={v.id}
                          className="p-3 bg-[#F8F9FA] border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="font-display text-sm font-bold text-slate-950 truncate">
                              {v.year} {v.make} {v.model}
                            </p>
                            <p className="font-mono text-xs text-slate-500">
                              {v.stockNo} · {v.yardPort} · CIF ${c.totalCifUsd.toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveVehicle(v.id)}
                            aria-label={`Remove ${v.make} ${v.model}`}
                            className="p-1.5 text-slate-400 hover:text-[#B91C1C] rounded cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Port & Subtotal */}
              {vehicles.length > 0 && (
                <div className="p-4 bg-[#F8F9FA] border border-slate-200 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="drawer-port" className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Destination Port
                      </label>
                      <select
                        id="drawer-port"
                        value={selectedPort.id}
                        onChange={(e) => {
                          const found = DESTINATION_PORTS.find((p) => p.id === e.target.value);
                          if (found) onChangePort(found);
                        }}
                        className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900"
                      >
                        {DESTINATION_PORTS.map((port) => (
                          <option key={port.id} value={port.id}>
                            {port.portName}, {port.country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="drawer-method" className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Shipping Method
                      </label>
                      <select
                        id="drawer-method"
                        value={shippingMethod}
                        onChange={(e) => onChangeShippingMethod(e.target.value as ShippingMethod)}
                        className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900"
                      >
                        <option value="Ro-Ro Vessel">Ro-Ro Vessel</option>
                        <option value="Container (20ft)">Container (20ft)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Total FOB</span>
                      <span className="font-mono tabular-nums">${totals.fob.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Ocean Freight &amp; Inspection</span>
                      <span className="font-mono tabular-nums">
                        ${(totals.freight + totals.inspection).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Marine Cargo Insurance</span>
                      <span className="font-mono tabular-nums">${totals.insurance.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-slate-950">
                      <span>Estimated Total CIF</span>
                      <span className="font-mono text-base text-[#B91C1C] tabular-nums">
                        ${totals.cif.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Buyer Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-200">
                <h3 className="font-display text-sm font-bold text-slate-950">
                  Consignee &amp; Buyer Details
                </h3>

                {errorMsg && (
                  <p role="alert" className="p-3 text-xs font-medium text-[#991B1B] bg-red-50 border border-red-200 rounded-lg">
                    {errorMsg}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="buyer-name" className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="buyer-name"
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Samuel Ochieng"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                  <div>
                    <label htmlFor="company-name" className="block text-xs font-medium text-slate-700 mb-1">
                      Dealership / Company
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="buyer-email" className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="buyer-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                  <div>
                    <label htmlFor="buyer-phone" className="block text-xs font-medium text-slate-700 mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      id="buyer-phone"
                      type="tel"
                      required
                      value={phoneWhatsApp}
                      onChange={(e) => setPhoneWhatsApp(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="buyer-notes" className="block text-xs font-medium text-slate-700 mb-1">
                    Inspection or Consignee Notes
                  </label>
                  <textarea
                    id="buyer-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify consignee name for Bill of Lading or preferred inspection agency..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors cursor-pointer"
                >
                  Confirm &amp; Generate Proforma Request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

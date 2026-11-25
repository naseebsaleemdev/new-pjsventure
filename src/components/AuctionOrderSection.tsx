import { useState, type FormEvent } from 'react';
import { CheckCircle2, Gavel } from 'lucide-react';
import { DESTINATION_PORTS } from '../data/ports';
import { DestinationPort, PortalQuery } from '../types/vehicle';

interface AuctionOrderSectionProps {
  selectedPort: DestinationPort;
  onSubmitAuctionQuery: (
    query: Omit<PortalQuery, 'id' | 'referenceId' | 'status' | 'createdAt'>
  ) => PortalQuery;
}

export function AuctionOrderSection({
  selectedPort,
  onSubmitAuctionQuery,
}: AuctionOrderSectionProps) {
  const [targetVehicle, setTargetVehicle] = useState('');
  const [targetYear, setTargetYear] = useState('2020 or Newer');
  const [minGrade, setMinGrade] = useState('Grade 4.0+');
  const [budgetUsd, setBudgetUsd] = useState('');
  const [portId, setPortId] = useState(selectedPort.id);
  const [contactEmail, setContactEmail] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!targetVehicle.trim() || !contactEmail.trim()) return;
    const port = DESTINATION_PORTS.find((p) => p.id === portId) || selectedPort;
    const created = onSubmitAuctionQuery({
      type: 'Auction Request',
      buyerName: 'Auction Desk Lead',
      companyName: 'Direct Portal Inquiry',
      email: contactEmail.trim(),
      phoneWhatsApp: contactEmail.trim(),
      destinationPort: `${port.portName}, ${port.country}`,
      subject: `${targetVehicle.trim()} · ${targetYear} · ${minGrade}`,
      vehicleRefs: [],
      notes: `Max FOB Budget: ${budgetUsd || 'Flexible'}`,
    });
    setSubmittedRef(created.referenceId);
  };

  return (
    <section
      id="auction"
      className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B91C1C]">
            <Gavel className="w-4 h-4" aria-hidden="true" />
            <span>Direct Japanese Auto Auction Desk</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-950 tracking-tight [text-wrap:balance]">
            Source Directly from 120+ Live Japanese Auto Auctions
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cannot find your exact trim or color in yard stock? Pjs Venture holds direct bidding memberships at USS Tokyo, TAA Yokohama, HAA Kobe, and JU Auctions—giving you translated auction sheets before placing a bid.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 pt-1">
            <li>· English-translated USS / TAA auction inspection sheets</li>
            <li>· On-floor physical chassis &amp; engine check before bidding</li>
            <li>· Transparent commission with zero hidden yard fees</li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          {submittedRef ? (
            <div className="p-6 bg-[#F8F9FA] border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-mono text-xs font-semibold text-emerald-800">
                    {submittedRef} — Auction Sourcing Order Logged
                  </p>
                  <h3 className="mt-1 font-display text-base font-bold text-slate-950">
                    Auction Sheet Alert Active for {targetVehicle}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Our Yokohama bidding desk will email matching USS/TAA auction lots with English sheet translations to {contactEmail}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmittedRef(null);
                  setTargetVehicle('');
                  setBudgetUsd('');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Submit Another Auction Request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-5 bg-[#F8F9FA] border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3.5"
            >
              <div className="sm:col-span-2">
                <label htmlFor="auc-vehicle" className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Make &amp; Model *
                </label>
                <input
                  id="auc-vehicle"
                  type="text"
                  required
                  value={targetVehicle}
                  onChange={(e) => setTargetVehicle(e.target.value)}
                  placeholder="e.g. 2021 Toyota RAV4 Adventure Hybrid"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label htmlFor="auc-year" className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum Year
                </label>
                <select
                  id="auc-year"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                >
                  <option>2022 or Newer</option>
                  <option>2020 or Newer</option>
                  <option>2018 or Newer</option>
                  <option>2015 or Newer</option>
                </select>
              </div>

              <div>
                <label htmlFor="auc-grade" className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum Auction Grade
                </label>
                <select
                  id="auc-grade"
                  value={minGrade}
                  onChange={(e) => setMinGrade(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                >
                  <option>Grade 4.5+</option>
                  <option>Grade 4.0+</option>
                  <option>Grade 3.5+</option>
                </select>
              </div>

              <div>
                <label htmlFor="auc-budget" className="block text-xs font-semibold text-slate-700 mb-1">
                  Max FOB Budget (USD)
                </label>
                <input
                  id="auc-budget"
                  type="text"
                  value={budgetUsd}
                  onChange={(e) => setBudgetUsd(e.target.value)}
                  placeholder="e.g. $24,000"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="auc-port" className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Port
                </label>
                <select
                  id="auc-port"
                  value={portId}
                  onChange={(e) => setPortId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                >
                  {DESTINATION_PORTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.portName}, {p.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                <div className="flex-1">
                  <label htmlFor="auc-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email or WhatsApp Contact *
                  </label>
                  <input
                    id="auc-email"
                    type="text"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="buyer@company.com / +254..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0F172A] hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Request Auction Sheets
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

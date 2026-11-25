import { useState, type FormEvent } from 'react';
import { CheckCircle2, Gavel } from 'lucide-react';
import { DESTINATION_PORTS } from '../data/ports';
import { DestinationPort, PortalQuery } from '../types/vehicle';

interface AuctionPageProps {
  selectedPort: DestinationPort;
  onSubmitAuctionQuery: (
    query: Omit<PortalQuery, 'id' | 'referenceId' | 'status' | 'createdAt'>
  ) => PortalQuery;
}

const AUCTION_HOUSES = [
  { name: 'USS Tokyo & Nagoya', schedule: 'Tue & Thu Weekly', volume: '25,000+ lots/week' },
  { name: 'TAA (Toyota Auto Auction)', schedule: 'Tue, Thu & Sat', volume: 'Dealer-grade Toyotas' },
  { name: 'HAA Kobe & Osaka', schedule: 'Wednesday & Saturday', volume: '12,000+ Kansai lots' },
  { name: 'JU & CAA Regional Auctions', schedule: 'Mon–Fri Daily', volume: 'Commercial vans & trucks' },
];

const AUCTION_GRADES = [
  { grade: 'Grade 5 / S', exterior: 'Near-new, minimal mileage', interior: 'Grade A (Showroom)' },
  { grade: 'Grade 4.5', exterior: 'Light micro-scratches only, no panel repair', interior: 'Grade A / B (Very Clean)' },
  { grade: 'Grade 4.0', exterior: 'Normal light wear consistent with age', interior: 'Grade B (Clean, Non-smoker)' },
  { grade: 'Grade 3.5', exterior: 'Visible dents/scratches or minor paintwork', interior: 'Grade B / C (Commercial use)' },
  { grade: 'Grade R / RA', exterior: 'Repaired outer panel; verified roadworthy', interior: 'Budget export option' },
];

export function AuctionPage({ selectedPort, onSubmitAuctionQuery }: AuctionPageProps) {
  const [targetVehicle, setTargetVehicle] = useState('');
  const [targetYear, setTargetYear] = useState('2020 or Newer');
  const [minGrade, setMinGrade] = useState('Grade 4.5+');
  const [maxBudget, setMaxBudget] = useState('');
  const [portId, setPortId] = useState(selectedPort.id);
  const [buyerName, setBuyerName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState<PortalQuery | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!targetVehicle.trim() || !buyerName.trim() || !email.trim()) return;

    const port = DESTINATION_PORTS.find((p) => p.id === portId) || selectedPort;
    const created = onSubmitAuctionQuery({
      type: 'Auction Request',
      buyerName: buyerName.trim(),
      companyName: 'Auction Buyer',
      email: email.trim(),
      phoneWhatsApp: phoneWhatsApp.trim() || 'Via Email',
      destinationPort: `${port.portName}, ${port.country}`,
      subject: `${targetVehicle.trim()} · ${targetYear} · ${minGrade}`,
      vehicleRefs: [],
      notes: `Max FOB Budget: ${maxBudget || 'Open'}. ${notes.trim()}`.trim(),
    });

    setSubmitted(created);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B91C1C]">
          <Gavel className="w-4 h-4" aria-hidden="true" />
          <span>Pjs Venture Japanese Auto Auction Desk</span>
        </div>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          Direct Bidding Access to 120+ Japanese Auto Auctions
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Buy directly from USS, TAA, HAA, and JU auction halls at true wholesale hammer prices. Our bilingual Yokohama inspectors verify chassis numbers, engine compression, and translated auction sheets prior to every bid.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUCTION_HOUSES.map((house) => (
            <div key={house.name} className="p-4 bg-[#F8F9FA] border border-slate-200 rounded-xl">
              <h2 className="font-display text-sm font-bold text-slate-950">{house.name}</h2>
              <p className="font-mono text-xs text-[#B91C1C] mt-1">{house.schedule}</p>
              <p className="text-xs text-slate-600 mt-1">{house.volume}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Auction Grade Guide */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-display text-lg font-bold text-slate-950 pb-3 border-b border-slate-200">
            Japanese Auction Sheet Grading Standard
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 pr-3 font-semibold">Overall Grade</th>
                  <th className="py-2.5 pr-3 font-semibold">Exterior Condition</th>
                  <th className="py-2.5 font-semibold">Interior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AUCTION_GRADES.map((row) => (
                  <tr key={row.grade}>
                    <td className="py-3 pr-3 font-mono font-bold text-slate-950 whitespace-nowrap">
                      {row.grade}
                    </td>
                    <td className="py-3 pr-3 text-slate-700">{row.exterior}</td>
                    <td className="py-3 text-slate-600">{row.interior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Auction Bid Request Form */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-display text-lg font-bold text-slate-950">
            Submit an Auction Sourcing Request
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Requests route directly to our Yokohama bidding team and appear in the Admin Portal Queries log.
          </p>

          {submitted ? (
            <div className="mt-5 p-5 bg-[#F8F9FA] border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-mono text-xs font-semibold text-emerald-800">
                    {submitted.referenceId} — Auction Order Queued
                  </p>
                  <p className="text-sm font-bold text-slate-950 mt-1">
                    {submitted.subject}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Our bidding desk will send upcoming USS &amp; TAA auction lots with English sheet translations to {submitted.email}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(null);
                  setTargetVehicle('');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
              >
                Submit Another Auction Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label htmlFor="ap-vehicle" className="block text-xs font-semibold text-slate-700 mb-1">
                  Make, Model &amp; Preferred Trim *
                </label>
                <input
                  id="ap-vehicle"
                  type="text"
                  required
                  value={targetVehicle}
                  onChange={(e) => setTargetVehicle(e.target.value)}
                  placeholder="e.g. Toyota Land Cruiser Prado TX-L Pearl White"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label htmlFor="ap-year" className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum Year
                </label>
                <select
                  id="ap-year"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  <option>2022 or Newer</option>
                  <option>2020 or Newer</option>
                  <option>2018 or Newer</option>
                  <option>2015 or Newer</option>
                </select>
              </div>

              <div>
                <label htmlFor="ap-grade" className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum Auction Grade
                </label>
                <select
                  id="ap-grade"
                  value={minGrade}
                  onChange={(e) => setMinGrade(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  <option>Grade 4.5+</option>
                  <option>Grade 4.0+</option>
                  <option>Grade 3.5+</option>
                </select>
              </div>

              <div>
                <label htmlFor="ap-budget" className="block text-xs font-semibold text-slate-700 mb-1">
                  Max FOB Budget (USD)
                </label>
                <input
                  id="ap-budget"
                  type="text"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  placeholder="e.g. $26,000"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="ap-port" className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Port
                </label>
                <select
                  id="ap-port"
                  value={portId}
                  onChange={(e) => setPortId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  {DESTINATION_PORTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.portName}, {p.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ap-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  id="ap-name"
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="ap-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Phone
                </label>
                <input
                  id="ap-phone"
                  type="tel"
                  value={phoneWhatsApp}
                  onChange={(e) => setPhoneWhatsApp(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="ap-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="ap-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="buyer@company.com"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="ap-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                  Color, Mileage &amp; Option Preferences
                </label>
                <textarea
                  id="ap-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify preferred colors, sunroof, leather seats, or max mileage..."
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors cursor-pointer"
                >
                  Submit Auction Bidding Order
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

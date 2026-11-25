import { useEffect, useState, type FormEvent } from 'react';
import { Building2, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { DESTINATION_PORTS } from '../data/ports';
import { DestinationPort, PortalQuery } from '../types/vehicle';

interface ContactPageProps {
  selectedPort: DestinationPort;
  onSubmitContactQuery: (
    query: Omit<PortalQuery, 'id' | 'referenceId' | 'status' | 'createdAt'>
  ) => PortalQuery;
}

export function ContactPage({
  selectedPort,
  onSubmitContactQuery,
}: ContactPageProps) {
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [portId, setPortId] = useState(selectedPort.id);
  const [subject, setSubject] = useState('Dealer Partnership & Bulk Export Inquiry');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState<PortalQuery | null>(null);

  useEffect(() => {
    setPortId(selectedPort.id);
  }, [selectedPort.id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !email.trim() || !notes.trim()) return;

    const port = DESTINATION_PORTS.find((p) => p.id === portId) || selectedPort;
    const created = onSubmitContactQuery({
      type: 'General Contact',
      buyerName: buyerName.trim(),
      companyName: companyName.trim() || 'Private Buyer',
      email: email.trim(),
      phoneWhatsApp: phoneWhatsApp.trim() || 'Not provided',
      destinationPort: `${port.portName}, ${port.country}`,
      subject,
      vehicleRefs: [],
      notes: notes.trim(),
    });

    setSubmitted(created);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* About Pjs Venture & Offices */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <p className="text-xs font-semibold text-[#B91C1C]">
              About Pjs Venture Co., Ltd.
            </p>
            <h1 className="font-display text-2xl font-bold text-slate-950 tracking-tight">
              Your Direct Automotive Export Partner in Japan
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pjs Venture operates dedicated vehicle inspection and container stuffing yards across Yokohama, Nagoya, Kobe, and Hakata. We supply franchised dealers, fleet operators, and individual importers across East Africa, the Caribbean, South Asia, Oceania, and the Middle East.
            </p>

            <dl className="pt-3 border-t border-slate-200 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-slate-950">Yokohama Head Office &amp; Yard</dt>
                  <dd className="text-slate-600 mt-0.5">
                    Daikoku-futo Export Terminal, Tsurumi-ku, Yokohama 230-0054, Japan
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-slate-950">Kansai &amp; Chubu Depots</dt>
                  <dd className="text-slate-600 mt-0.5">
                    Kobe Port Island Terminal · Nagoya Kinjo Pier · Hakata Island City
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-slate-950">Export Sales &amp; Documentation</dt>
                  <dd className="font-mono text-slate-600 mt-0.5">dispatch@pjsventure.jp</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-slate-950">Dispatch Desk Hours</dt>
                  <dd className="font-mono text-slate-600 mt-0.5">Mon–Sat 09:00–18:30 JST</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        {/* Contact & Support Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-slate-950">
            Contact Export Support
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            All contact messages are logged directly in the Pjs Venture Admin Portal for prompt response.
          </p>

          {submitted ? (
            <div className="mt-5 p-5 bg-[#F8F9FA] border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-mono text-xs font-semibold text-emerald-800">
                    {submitted.referenceId} — Support Ticket Created
                  </p>
                  <h3 className="font-display text-base font-bold text-slate-950 mt-1">
                    Thank you, {submitted.buyerName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your inquiry regarding &ldquo;{submitted.subject}&rdquo; has been received by our Yokohama export team.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(null);
                  setNotes('');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ct-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="ct-name"
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label htmlFor="ct-company" className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Dealership
                </label>
                <input
                  id="ct-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label htmlFor="ct-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="ct-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label htmlFor="ct-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Phone
                </label>
                <input
                  id="ct-phone"
                  type="tel"
                  value={phoneWhatsApp}
                  onChange={(e) => setPhoneWhatsApp(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label htmlFor="ct-subject" className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Topic
                </label>
                <select
                  id="ct-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg"
                >
                  <option>Dealer Partnership &amp; Bulk Export Inquiry</option>
                  <option>Shipping Schedule &amp; Freight Quotation</option>
                  <option>Payment &amp; Proforma Verification</option>
                  <option>Inspection &amp; Export Certificate Help</option>
                </select>
              </div>

              <div>
                <label htmlFor="ct-port" className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Port
                </label>
                <select
                  id="ct-port"
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

              <div className="sm:col-span-2">
                <label htmlFor="ct-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="ct-notes"
                  rows={4}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us how our Yokohama export desk can assist you..."
                  className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors cursor-pointer"
                >
                  Send Message to Pjs Venture
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

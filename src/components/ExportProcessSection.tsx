import { useMemo, useState } from 'react';
import { Anchor, Search } from 'lucide-react';
import { DESTINATION_PORTS } from '../data/ports';
import { DestinationPort, PortRegion } from '../types/vehicle';

interface ExportProcessSectionProps {
  selectedPort: DestinationPort;
  onSelectPort: (port: DestinationPort) => void;
}

const STEPS = [
  {
    number: '01.',
    title: 'Stock Selection & Proforma Invoice',
    detail:
      'Select verified inventory or submit an auction order. Pjs Venture issues an official Proforma Invoice locking the vehicle price and vessel space for 48 hours.',
  },
  {
    number: '02.',
    title: 'JEVIC / QISJ Pre-Export Inspection',
    detail:
      'Every unit undergoes mandatory odometer verification, radiation screening, and mechanical roadworthiness certification tailored to your destination country.',
  },
  {
    number: '03.',
    title: 'Deregistration & Ro-Ro Vessel Loading',
    detail:
      'Our Yokohama customs desk completes Japanese export deregistration and books the earliest Ro-Ro or container sailing from Yokohama, Nagoya, Kobe, or Hakata.',
  },
  {
    number: '04.',
    title: 'DHL Document & Bill of Lading Dispatch',
    detail:
      'Once the vessel departs, we courier the Original Bill of Lading, Export Certificate, and Inspection Certificate via DHL Express straight to your clearing agent.',
  },
];

const REGIONS: ('All Regions' | PortRegion)[] = [
  'All Regions',
  'East Africa',
  'West Africa',
  'Southern Africa',
  'North Africa',
  'Middle East',
  'South Asia',
  'Southeast & East Asia',
  'Oceania',
  'UK & Europe',
  'Caribbean',
  'North & Central America',
  'South America',
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function ExportProcessSection({
  selectedPort,
  onSelectPort,
}: ExportProcessSectionProps) {
  const [regionFilter, setRegionFilter] = useState<'All Regions' | PortRegion>('All Regions');
  const [letterFilter, setLetterFilter] = useState<string>('ALL');
  const [portQuery, setPortQuery] = useState<string>('');

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    DESTINATION_PORTS.forEach((p) => {
      const first = p.portName.trim().charAt(0).toUpperCase();
      if (first) set.add(first);
    });
    return set;
  }, []);

  const filteredPorts = useMemo(() => {
    const q = portQuery.trim().toLowerCase();
    return DESTINATION_PORTS.filter((p) => {
      if (regionFilter !== 'All Regions' && p.region !== regionFilter) return false;
      if (
        letterFilter !== 'ALL' &&
        p.portName.trim().charAt(0).toUpperCase() !== letterFilter
      ) {
        return false;
      }
      if (q) {
        const hay =
          `${p.portName} ${p.country} ${p.region} ${p.mandatoryInspection}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [regionFilter, letterFilter, portQuery]);

  return (
    <div className="bg-white border-t border-slate-200">
      {/* Export Process */}
      <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-slate-500">
            How Pjs Venture Ships Worldwide
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight [text-wrap:balance]">
            Transparent Four-Step Export Workflow
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From Japanese auction floor to port clearance in your country, every inspection and shipping document is handled in-house.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="p-6 bg-[#F8F9FA] border border-slate-200 rounded-xl flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-sm font-semibold text-[#B91C1C]">
                  {step.number}
                </span>
                <h3 className="mt-2 font-display text-base font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shipping Ports & Freight Schedule Matrix (A to Z Global Directory) */}
      <section
        id="ports"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Active Japanese Departure Yards: Yokohama · Nagoya · Kobe · Hakata · Osaka
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Global A–Z Destination Ports &amp; Ocean Freight Rates
            </h2>
            <p className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
              Showing {filteredPorts.length} of {DESTINATION_PORTS.length} worldwide maritime auto-import ports
            </p>
          </div>

          {/* Live Port Search */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={portQuery}
              onChange={(e) => setPortQuery(e.target.value)}
              placeholder="Search port or country (e.g. Lagos, Dubai, Karachi)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#B91C1C]"
            />
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-lg">
          {REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setRegionFilter(region)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                regionFilter === region
                  ? 'bg-white text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* A to Z Alphabetical Quick Jump */}
        <div className="mt-3 flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setLetterFilter('ALL')}
            className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
              letterFilter === 'ALL'
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All A–Z
          </button>
          {ALPHABET.map((letter) => {
            const hasPorts = availableLetters.has(letter);
            const active = letterFilter === letter;
            return (
              <button
                key={letter}
                type="button"
                disabled={!hasPorts}
                onClick={() => setLetterFilter(active ? 'ALL' : letter)}
                className={`w-7 h-7 text-xs font-mono font-semibold rounded border transition-colors ${
                  active
                    ? 'bg-[#B91C1C] text-white border-[#B91C1C] cursor-pointer'
                    : hasPorts
                      ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer'
                      : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <div className="mt-5 overflow-auto max-h-[560px] border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#F8F9FA] shadow-2xs">
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">Destination Port (A–Z)</th>
                <th className="py-3.5 px-4">Region</th>
                <th className="py-3.5 px-4 text-right">Ro-Ro Rate (/m³)</th>
                <th className="py-3.5 px-4 text-right">20ft Container</th>
                <th className="py-3.5 px-4">Est. Transit</th>
                <th className="py-3.5 px-4">Required Inspection</th>
                <th className="py-3.5 px-4 text-right">Apply to Catalog</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredPorts.length > 0 ? (
                filteredPorts.map((port) => {
                  const isSelected = port.id === selectedPort.id;
                  return (
                    <tr
                      key={port.id}
                      className={isSelected ? 'bg-[#B91C1C]/[0.05]' : 'bg-white hover:bg-slate-50'}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-950 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <Anchor className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                          <span>
                            {port.portName}, {port.country}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap text-xs">
                        {port.region}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-900 tabular-nums whitespace-nowrap">
                        ${port.roroRatePerM3}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-900 tabular-nums whitespace-nowrap">
                        ${port.containerFlatUsd.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        {port.transitDays}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {port.mandatoryInspection}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectPort(port);
                            document.getElementById('stock-list')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Active Port' : 'Select Port'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 px-4 text-center text-xs text-slate-500">
                    No ports matched your filter. Try clearing the search or selecting &quot;All Regions&quot; and &quot;All A–Z&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Buyer Security & Official Payment Advisory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="p-6 bg-[#F8F9FA] border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h3 className="font-display text-sm font-bold text-slate-950">
              Official Payment &amp; Anti-Fraud Buyer Notice
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Pjs Venture Co., Ltd. only accepts Telegraphic Transfer (TT) payments to our verified corporate bank accounts in Yokohama, Japan under the exact beneficiary name <strong className="text-slate-900">PJS VENTURE CO., LTD.</strong> Never remit funds to personal accounts or unverified third-party emails without confirming your Proforma Invoice reference directly with our Yokohama dispatch desk.
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-4 py-3">
            <span className="block text-[11px] text-slate-500">Official Dispatch Desk</span>
            <span>dispatch@pjsventure.jp</span>
          </div>
        </div>
      </section>
    </div>
  );
}

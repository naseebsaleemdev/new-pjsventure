import { useState } from 'react';
import { Anchor } from 'lucide-react';
import { DESTINATION_PORTS } from '../data/ports';
import { DestinationPort } from '../types/vehicle';

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

const REGIONS = [
  'All Regions',
  'East Africa',
  'Southern Africa',
  'Caribbean',
  'South Asia',
  'UK & Europe',
  'Oceania',
  'Middle East',
] as const;

export function ExportProcessSection({
  selectedPort,
  onSelectPort,
}: ExportProcessSectionProps) {
  const [regionFilter, setRegionFilter] = useState<string>('All Regions');

  const filteredPorts =
    regionFilter === 'All Regions'
      ? DESTINATION_PORTS
      : DESTINATION_PORTS.filter((p) => p.region === regionFilter);

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

      {/* Shipping Ports & Freight Schedule Matrix */}
      <section
        id="ports"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Active Japanese Departure Yards: Yokohama · Nagoya · Kobe · Hakata
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Global Destination Ports &amp; Ocean Freight Rates
            </h2>
          </div>

          {/* Interactive Region Filter */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setRegionFilter(region)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  regionFilter === region
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">Destination Port</th>
                <th className="py-3.5 px-4">Region</th>
                <th className="py-3.5 px-4 text-right">Ro-Ro Rate (/m³)</th>
                <th className="py-3.5 px-4 text-right">20ft Container</th>
                <th className="py-3.5 px-4">Est. Transit</th>
                <th className="py-3.5 px-4">Required Inspection</th>
                <th className="py-3.5 px-4 text-right">Apply to Catalog</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredPorts.map((port) => {
                const isSelected = port.id === selectedPort.id;
                return (
                  <tr
                    key={port.id}
                    className={isSelected ? 'bg-[#B91C1C]/[0.04]' : 'bg-white hover:bg-slate-50'}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-950 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <Anchor className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                        <span>
                          {port.portName}, {port.country}
                        </span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {port.region}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-900 tabular-nums whitespace-nowrap">
                      ${port.roroRatePerM3}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-900 tabular-nums whitespace-nowrap">
                      ${port.containerFlatUsd.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {port.transitDays}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {port.mandatoryInspection}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
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
              })}
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

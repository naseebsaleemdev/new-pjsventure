import { useState } from 'react';
import { ArrowLeft, Car, Check, Plus, X } from 'lucide-react';
import { calculateVehicleCif } from '../data/ports';
import { DestinationPort, ShippingMethod, Vehicle } from '../types/vehicle';

interface ComparePageProps {
  vehicles: Vehicle[];
  selectedPort: DestinationPort;
  shippingMethod: ShippingMethod;
  includeInsurance: boolean;
  inquiryIds: string[];
  onRemoveVehicle: (vehicleId: string) => void;
  onClearAll: () => void;
  onInspectVehicle: (vehicle: Vehicle) => void;
  onToggleInquiry: (vehicle: Vehicle) => void;
  onBackToStock: () => void;
}

interface SpecRow {
  key: string;
  label: string;
  getValue: (v: Vehicle) => string;
  getBestId?: (list: Vehicle[]) => string | null;
  mono?: boolean;
}

export function ComparePage({
  vehicles,
  selectedPort,
  shippingMethod,
  includeInsurance,
  inquiryIds,
  onRemoveVehicle,
  onClearAll,
  onInspectVehicle,
  onToggleInquiry,
  onBackToStock,
}: ComparePageProps) {
  const [differencesOnly, setDifferencesOnly] = useState(false);

  const lowestFobId =
    vehicles.length > 1
      ? vehicles.reduce((min, v) => (v.fobUsd < min.fobUsd ? v : min), vehicles[0]).id
      : null;

  const lowestMileageId =
    vehicles.length > 1
      ? vehicles.reduce((min, v) => (v.mileageKm < min.mileageKm ? v : min), vehicles[0]).id
      : null;

  const newestYearId =
    vehicles.length > 1
      ? vehicles.reduce((max, v) => (v.year > max.year ? v : max), vehicles[0]).id
      : null;

  const rows: SpecRow[] = [
    {
      key: 'fob',
      label: 'FOB Price (USD)',
      getValue: (v) => `$${v.fobUsd.toLocaleString()}`,
      getBestId: () => lowestFobId,
      mono: true,
    },
    {
      key: 'cif',
      label: `Est. CIF (${selectedPort.portName})`,
      getValue: (v) =>
        `$${calculateVehicleCif(v, selectedPort, shippingMethod, includeInsurance).totalCifUsd.toLocaleString()}`,
      getBestId: () => lowestFobId,
      mono: true,
    },
    {
      key: 'stock',
      label: 'Stock Number',
      getValue: (v) => v.stockNo,
      mono: true,
    },
    {
      key: 'grade',
      label: 'Auction Grade (Ext / Int)',
      getValue: (v) => `${v.auctionGrade} (${v.exteriorGrade} / ${v.interiorGrade})`,
      mono: true,
    },
    {
      key: 'year',
      label: 'Registration Year / Month',
      getValue: (v) => `${v.year}/${String(v.month).padStart(2, '0')}`,
      getBestId: () => newestYearId,
      mono: true,
    },
    {
      key: 'mileage',
      label: 'Mileage',
      getValue: (v) => `${v.mileageKm.toLocaleString()} km`,
      getBestId: () => lowestMileageId,
      mono: true,
    },
    {
      key: 'chassis',
      label: 'Chassis Code',
      getValue: (v) => v.chassisCode,
      mono: true,
    },
    {
      key: 'engine',
      label: 'Engine Displacement',
      getValue: (v) => `${v.engineCc.toLocaleString()} cc`,
      mono: true,
    },
    {
      key: 'fuel',
      label: 'Fuel Type',
      getValue: (v) => v.fuel,
    },
    {
      key: 'transmission',
      label: 'Transmission',
      getValue: (v) => v.transmission,
    },
    {
      key: 'drive',
      label: 'Drivetrain',
      getValue: (v) => v.drive,
    },
    {
      key: 'steering',
      label: 'Steering',
      getValue: (v) => v.steering,
    },
    {
      key: 'body',
      label: 'Body Type',
      getValue: (v) => v.bodyType,
    },
    {
      key: 'color',
      label: 'Exterior Color',
      getValue: (v) => v.color,
    },
    {
      key: 'capacity',
      label: 'Seats / Doors',
      getValue: (v) => `${v.seats} Seats / ${v.doors} Doors`,
      mono: true,
    },
    {
      key: 'yard',
      label: 'Japan Departure Port',
      getValue: (v) => `${v.yardPort} Port`,
    },
    {
      key: 'volume',
      label: 'Shipping Volume',
      getValue: (v) => `${v.m3Volume} m³`,
      mono: true,
    },
    {
      key: 'inspection',
      label: 'Pre-Export Inspection',
      getValue: (v) => v.inspectionAgency,
    },
  ];

  const visibleRows = differencesOnly
    ? rows.filter((row) => {
        if (vehicles.length <= 1) return true;
        const vals = vehicles.map((v) => row.getValue(v));
        return new Set(vals).size > 1;
      })
    : rows;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToStock}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#B91C1C] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Stock List</span>
          </button>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-950 tracking-tight">
            Side-by-Side Vehicle Comparison
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
            Comparing {vehicles.length} of 4 max units · Destination Port: {selectedPort.portName} ({shippingMethod})
          </p>
        </div>

        {vehicles.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={differencesOnly}
                onChange={(e) => setDifferencesOnly(e.target.checked)}
                className="h-4 w-4 accent-[#B91C1C] cursor-pointer"
              />
              <span>Show Differences Only</span>
            </label>
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Clear Comparison
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {vehicles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Car className="w-10 h-10 text-slate-400 mx-auto mb-3" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-slate-950">
            No vehicles selected for comparison
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Select &ldquo;Compare&rdquo; on two or more vehicles in the Japan Export Stock List to compare FOB/CIF prices, mileage, auction grades, and chassis specs side-by-side.
          </p>
          <button
            type="button"
            onClick={onBackToStock}
            className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
          >
            Browse Export Stock
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F8F9FA] align-top">
                  <th className="w-52 p-4 text-xs font-semibold text-slate-600 sticky left-0 bg-[#F8F9FA] z-10 border-r border-slate-200">
                    Vehicle Overview
                  </th>
                  {vehicles.map((v) => {
                    const inQuote = inquiryIds.includes(v.id);
                    return (
                      <th key={v.id} className="p-4 min-w-[230px] border-r last:border-r-0 border-slate-200">
                        <div className="space-y-3">
                          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                            <img
                              src={v.imageUrl}
                              alt={`${v.year} ${v.make} ${v.model}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => onRemoveVehicle(v.id)}
                              aria-label={`Remove ${v.make} ${v.model} from comparison`}
                              className="absolute top-2 right-2 p-1 rounded-md bg-slate-950/75 text-white hover:bg-[#B91C1C] cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => onInspectVehicle(v)}
                              className="font-display text-sm font-bold text-slate-950 hover:text-[#B91C1C] text-left cursor-pointer"
                            >
                              {v.year} {v.make} {v.model}
                            </button>
                            <p className="text-xs font-normal text-slate-500 truncate">
                              {v.trim}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => onInspectVehicle(v)}
                              className="flex-1 py-1.5 px-2 text-[11px] font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer whitespace-nowrap"
                            >
                              View Page
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleInquiry(v)}
                              className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-semibold rounded-md cursor-pointer whitespace-nowrap ${
                                inQuote
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-[#B91C1C] text-white hover:bg-[#991B1B]'
                              }`}
                            >
                              {inQuote ? (
                                <>
                                  <Check className="w-3 h-3" aria-hidden="true" />
                                  <span>In Quote</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" aria-hidden="true" />
                                  <span>Add Quote</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-xs">
                {visibleRows.map((row) => {
                  const bestId = row.getBestId ? row.getBestId(vehicles) : null;
                  return (
                    <tr key={row.key} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-semibold text-slate-600 bg-[#F8F9FA] sticky left-0 z-10 border-r border-slate-200">
                        {row.label}
                      </td>
                      {vehicles.map((v) => {
                        const isBest = bestId === v.id;
                        return (
                          <td
                            key={v.id}
                            className={`p-3.5 border-r last:border-r-0 border-slate-200 ${
                              row.mono ? 'font-mono tabular-nums' : ''
                            } ${
                              isBest
                                ? 'bg-emerald-50/70 font-bold text-emerald-900'
                                : 'text-slate-900'
                            }`}
                          >
                            {row.getValue(v)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Equipped Options Row */}
                <tr className="align-top">
                  <td className="p-3.5 font-semibold text-slate-600 bg-[#F8F9FA] sticky left-0 z-10 border-r border-slate-200">
                    Equipped Features
                  </td>
                  {vehicles.map((v) => (
                    <td
                      key={v.id}
                      className="p-3.5 border-r last:border-r-0 border-slate-200 text-slate-700"
                    >
                      <ul className="space-y-1">
                        {v.features.map((f) => (
                          <li key={f} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

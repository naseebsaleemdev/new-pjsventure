import { Car, ChevronRight, Truck } from 'lucide-react';
import { BodyType, Vehicle } from '../types/vehicle';

export type PriceBracket = 'all' | 'under-10k' | '10k-20k' | '20k-30k' | 'over-30k';
export type SpecialFilter =
  | 'all'
  | 'hybrid'
  | 'diesel-4wd'
  | 'low-mileage'
  | 'lhd'
  | 'grade-45';

interface PortalSidebarProps {
  vehicles: Vehicle[];
  selectedMake: string;
  selectedBodyType: BodyType;
  priceBracket: PriceBracket;
  specialFilter: SpecialFilter;
  selectedYard: string;
  onSelectMake: (make: string) => void;
  onSelectBodyType: (bodyType: BodyType) => void;
  onSelectPriceBracket: (bracket: PriceBracket) => void;
  onSelectSpecialFilter: (filter: SpecialFilter) => void;
  onSelectYard: (yard: string) => void;
  onResetAll: () => void;
}

const BODY_TYPES: BodyType[] = [
  'SUV',
  'Sedan',
  'Hatchback',
  'Van / Mini Van',
  'Pickup',
  'Truck',
];

const YARDS = ['Yokohama', 'Nagoya', 'Kobe', 'Hakata', 'Osaka'];

export function PortalSidebar({
  vehicles,
  selectedMake,
  selectedBodyType,
  priceBracket,
  specialFilter,
  selectedYard,
  onSelectMake,
  onSelectBodyType,
  onSelectPriceBracket,
  onSelectSpecialFilter,
  onSelectYard,
  onResetAll,
}: PortalSidebarProps) {
  const makeCounts = vehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.make] = (acc[v.make] || 0) + 1;
    return acc;
  }, {});

  const sortedMakes = Object.entries(makeCounts).sort((a, b) => b[1] - a[1]);

  const bodyCounts = vehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.bodyType] = (acc[v.bodyType] || 0) + 1;
    return acc;
  }, {});

  const yardCounts = vehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.yardPort] = (acc[v.yardPort] || 0) + 1;
    return acc;
  }, {});

  const priceBrackets: { id: PriceBracket; label: string; count: number }[] = [
    {
      id: 'under-10k',
      label: 'Under $10,000',
      count: vehicles.filter((v) => v.fobUsd < 10000).length,
    },
    {
      id: '10k-20k',
      label: '$10,000 – $20,000',
      count: vehicles.filter((v) => v.fobUsd >= 10000 && v.fobUsd <= 20000).length,
    },
    {
      id: '20k-30k',
      label: '$20,000 – $30,000',
      count: vehicles.filter((v) => v.fobUsd > 20000 && v.fobUsd <= 30000).length,
    },
    {
      id: 'over-30k',
      label: 'Over $30,000',
      count: vehicles.filter((v) => v.fobUsd > 30000).length,
    },
  ];

  const specialCategories: { id: SpecialFilter; label: string; count: number }[] = [
    {
      id: 'hybrid',
      label: 'Hybrid Vehicles',
      count: vehicles.filter((v) => v.fuel === 'Hybrid').length,
    },
    {
      id: 'diesel-4wd',
      label: 'Diesel 4WD / AWD',
      count: vehicles.filter((v) => v.fuel === 'Diesel' && v.drive !== '2WD').length,
    },
    {
      id: 'low-mileage',
      label: 'Low Mileage (<35k km)',
      count: vehicles.filter((v) => v.mileageKm < 35000).length,
    },
    {
      id: 'lhd',
      label: 'Left-Hand Drive (LHD)',
      count: vehicles.filter((v) => v.steering === 'LHD').length,
    },
    {
      id: 'grade-45',
      label: 'Auction Grade 4.5+',
      count: vehicles.filter((v) => parseFloat(v.auctionGrade) >= 4.5).length,
    },
  ];

  const hasActive =
    selectedMake !== 'All' ||
    selectedBodyType !== 'All' ||
    priceBracket !== 'all' ||
    specialFilter !== 'all' ||
    selectedYard !== 'All';

  return (
    <aside aria-label="Vehicle Directory Filters" className="w-full lg:w-64 shrink-0 space-y-4">
      {hasActive && (
        <button
          type="button"
          onClick={onResetAll}
          className="w-full py-2 px-3 text-xs font-semibold text-[#B91C1C] bg-white border border-[#B91C1C]/30 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          Clear Sidebar Filters
        </button>
      )}

      {/* Search by Make */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-[#0F172A] text-white flex items-center justify-between">
          <h2 className="font-display text-xs font-bold tracking-wide">
            Search by Make
          </h2>
          <span className="font-mono text-[11px] text-slate-300 tabular-nums">
            {vehicles.length}
          </span>
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          <li>
            <button
              type="button"
              onClick={() => onSelectMake('All')}
              className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                selectedMake === 'All'
                  ? 'bg-red-50/70 font-semibold text-[#B91C1C]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>All Makes</span>
              <span className="font-mono text-xs text-slate-500 tabular-nums">
                {vehicles.length}
              </span>
            </button>
          </li>
          {sortedMakes.map(([make, count]) => (
            <li key={make}>
              <button
                type="button"
                onClick={() => onSelectMake(selectedMake === make ? 'All' : make)}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  selectedMake === make
                    ? 'bg-red-50/70 font-semibold text-[#B91C1C]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>{make}</span>
                </span>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Search by Body Type */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display text-xs font-bold text-slate-900">
            Search by Body Type
          </h2>
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          {BODY_TYPES.map((type) => (
            <li key={type}>
              <button
                type="button"
                onClick={() =>
                  onSelectBodyType(selectedBodyType === type ? 'All' : type)
                }
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  selectedBodyType === type
                    ? 'bg-red-50/70 font-semibold text-[#B91C1C]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {type === 'Truck' || type === 'Pickup' ? (
                    <Truck className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  ) : (
                    <Car className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  )}
                  <span>{type}</span>
                </span>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {bodyCounts[type] || 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Shop by Price (FOB) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
          <h2 className="font-display text-xs font-bold text-slate-900">
            Shop by FOB Price
          </h2>
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          {priceBrackets.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() =>
                  onSelectPriceBracket(priceBracket === b.id ? 'all' : b.id)
                }
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  priceBracket === b.id
                    ? 'bg-red-50/70 font-semibold text-[#B91C1C]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{b.label}</span>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {b.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Special Categories */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
          <h2 className="font-display text-xs font-bold text-slate-900">
            Export Categories
          </h2>
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          {specialCategories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() =>
                  onSelectSpecialFilter(specialFilter === c.id ? 'all' : c.id)
                }
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  specialFilter === c.id
                    ? 'bg-red-50/70 font-semibold text-[#B91C1C]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{c.label}</span>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {c.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Japan Yard Location */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
          <h2 className="font-display text-xs font-bold text-slate-900">
            Japan Export Yard
          </h2>
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          {YARDS.map((yard) => (
            <li key={yard}>
              <button
                type="button"
                onClick={() => onSelectYard(selectedYard === yard ? 'All' : yard)}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  selectedYard === yard
                    ? 'bg-red-50/70 font-semibold text-[#B91C1C]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{yard} Port</span>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {yardCounts[yard] || 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

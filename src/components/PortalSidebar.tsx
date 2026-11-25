import { useState } from 'react';
import {
  Accessibility,
  AlertTriangle,
  Bus,
  Car,
  ChevronDown,
  ChevronRight,
  Cog,
  Fuel,
  Gauge,
  Globe,
  Leaf,
  MapPin,
  Percent,
  Tag,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react';
import { BodyType, Vehicle } from '../types/vehicle';

export type PriceBracket =
  | 'all'
  | 'under-500'
  | '500-1000'
  | '1000-1500'
  | '1500-2000'
  | '2000-2500'
  | '2500-4000'
  | 'over-4000';

export type DiscountBracket =
  | 'all'
  | '70-plus'
  | '60-plus'
  | '50-plus'
  | '40-plus'
  | '30-plus'
  | '1-30';

export type SpecialFilter =
  | 'all'
  | 'lhd'
  | 'fuel-efficient'
  | 'hybrid'
  | 'electric'
  | 'diesel'
  | 'manual'
  | 'handicapped'
  | 'salvage';

export function matchesMakeFilter(vehicleMake: string, selectedMake: string): boolean {
  if (selectedMake === 'All') return true;
  return vehicleMake.trim().toUpperCase() === selectedMake.trim().toUpperCase();
}

export function matchesBodyTypeFilter(vehicleBody: string, selectedBody: BodyType): boolean {
  if (selectedBody === 'All') return true;
  if (selectedBody === 'Pick up' || selectedBody === 'Pickup') {
    return vehicleBody === 'Pickup' || vehicleBody === 'Pick up';
  }
  if (selectedBody === 'Van') {
    return vehicleBody === 'Van' || vehicleBody === 'Van / Mini Van';
  }
  if (selectedBody === 'Mini Van') {
    return vehicleBody === 'Mini Van' || vehicleBody === 'Van / Mini Van';
  }
  if (selectedBody === 'Van / Mini Van') {
    return (
      vehicleBody === 'Van / Mini Van' ||
      vehicleBody === 'Van' ||
      vehicleBody === 'Mini Van'
    );
  }
  return vehicleBody === selectedBody;
}

export function matchesPriceBracket(fobUsd: number, bracket: PriceBracket): boolean {
  switch (bracket) {
    case 'all':
      return true;
    case 'under-500':
      return fobUsd < 500;
    case '500-1000':
      return fobUsd >= 500 && fobUsd <= 1000;
    case '1000-1500':
      return fobUsd > 1000 && fobUsd <= 1500;
    case '1500-2000':
      return fobUsd > 1500 && fobUsd <= 2000;
    case '2000-2500':
      return fobUsd > 2000 && fobUsd <= 2500;
    case '2500-4000':
      return fobUsd > 2500 && fobUsd <= 4000;
    case 'over-4000':
      return fobUsd > 4000;
  }
}

export function matchesDiscountBracket(
  discountPct: number | undefined,
  bracket: DiscountBracket
): boolean {
  if (bracket === 'all') return true;
  const pct = discountPct ?? 0;
  if (pct <= 0) return false;
  switch (bracket) {
    case '70-plus':
      return pct >= 70;
    case '60-plus':
      return pct >= 60;
    case '50-plus':
      return pct >= 50;
    case '40-plus':
      return pct >= 40;
    case '30-plus':
      return pct >= 30;
    case '1-30':
      return pct >= 1 && pct <= 30;
  }
}

export function matchesSpecialCategory(v: Vehicle, filter: SpecialFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'lhd':
      return v.steering === 'LHD';
    case 'fuel-efficient':
      return v.fuel === 'Hybrid' || v.fuel === 'Electric' || v.engineCc <= 1800;
    case 'hybrid':
      return v.fuel === 'Hybrid';
    case 'electric':
      return v.fuel === 'Electric';
    case 'diesel':
      return v.fuel === 'Diesel';
    case 'manual':
      return v.transmission === 'Manual';
    case 'handicapped': {
      const text = `${v.model} ${v.trim} ${v.features.join(' ')} ${v.inspectorNote}`.toLowerCase();
      return (
        text.includes('handicap') ||
        text.includes('wheelchair') ||
        text.includes('welcab') ||
        text.includes('disability')
      );
    }
    case 'salvage': {
      const grade = v.auctionGrade.trim().toUpperCase();
      const text = `${v.trim} ${v.inspectorNote}`.toLowerCase();
      return grade === 'R' || grade === 'RA' || grade === '0' || text.includes('salvage');
    }
  }
}

export function matchesStockCountry(v: Vehicle, selectedCountry: string): boolean {
  if (selectedCountry === 'All') return true;
  const country = (v.stockCountry || 'Japan').trim().toLowerCase();
  return country === selectedCountry.trim().toLowerCase();
}

interface PortalSidebarProps {
  vehicles: Vehicle[];
  selectedMake: string;
  selectedBodyType: BodyType;
  priceBracket: PriceBracket;
  discountBracket: DiscountBracket;
  specialFilter: SpecialFilter;
  selectedStockCountry: string;
  selectedYard: string;
  onSelectMake: (make: string) => void;
  onSelectBodyType: (bodyType: BodyType) => void;
  onSelectPriceBracket: (bracket: PriceBracket) => void;
  onSelectDiscountBracket: (bracket: DiscountBracket) => void;
  onSelectSpecialFilter: (filter: SpecialFilter) => void;
  onSelectStockCountry: (country: string) => void;
  onSelectYard: (yard: string) => void;
  onResetAll: () => void;
  onItemSelected?: () => void;
}

const BEFORWARD_MAKES = [
  'TOYOTA',
  'NISSAN',
  'HONDA',
  'MAZDA',
  'MITSUBISHI',
  'SUBARU',
  'SUZUKI',
  'ISUZU',
  'DAIHATSU',
  'HINO',
  'LEXUS',
  'MERCEDES-BENZ',
  'BMW',
  'VOLKSWAGEN',
  'AUDI',
  'PEUGEOT',
  'FORD',
  'VOLVO',
  'LAND ROVER',
  'JAGUAR',
  'JEEP',
  'CHEVROLET',
  'HYUNDAI',
  'KIA',
  'SSANGYONG',
  'RENAULT SAMSUNG',
];

const BODY_TYPES: { id: BodyType; label: string; kind: 'car' | 'truck' | 'bus' | 'gear' }[] = [
  { id: 'SUV', label: 'SUV', kind: 'car' },
  { id: 'Truck', label: 'Truck', kind: 'truck' },
  { id: 'Pick up', label: 'Pick up', kind: 'truck' },
  { id: 'Van', label: 'Van', kind: 'bus' },
  { id: 'Sedan', label: 'Sedan', kind: 'car' },
  { id: 'Bus', label: 'Bus', kind: 'bus' },
  { id: 'Mini Van', label: 'Mini Van', kind: 'bus' },
  { id: 'Hatchback', label: 'Hatchback', kind: 'car' },
  { id: 'Coupe', label: 'Coupe', kind: 'car' },
  { id: 'Convertible', label: 'Convertible', kind: 'car' },
  { id: 'Wagon', label: 'Wagon', kind: 'car' },
  { id: 'Mini Bus', label: 'Mini Bus', kind: 'bus' },
  { id: 'Machinery', label: 'Machinery', kind: 'gear' },
  { id: 'Forklift', label: 'Forklift', kind: 'gear' },
  { id: 'Tractor', label: 'Tractor', kind: 'gear' },
  { id: 'Tractor Head', label: 'Tractor Head', kind: 'truck' },
  { id: 'Motorcycle', label: 'Motorcycle', kind: 'car' },
];

const STOCK_COUNTRIES = [
  'Japan',
  'Korea',
  'Thailand',
  'United Kingdom',
  'Singapore',
  'UAE',
  'China',
  'Taiwan',
  'Australia',
  'Philippines',
  'Belgium',
];

const JAPAN_YARDS = ['Yokohama', 'Nagoya', 'Kobe', 'Hakata', 'Osaka'];

type SectionKey = 'make' | 'price' | 'discount' | 'type' | 'other' | 'stock';

export function PortalSidebar({
  vehicles,
  selectedMake,
  selectedBodyType,
  priceBracket,
  discountBracket,
  specialFilter,
  selectedStockCountry,
  selectedYard,
  onSelectMake,
  onSelectBodyType,
  onSelectPriceBracket,
  onSelectDiscountBracket,
  onSelectSpecialFilter,
  onSelectStockCountry,
  onSelectYard,
  onResetAll,
  onItemSelected,
}: PortalSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>({
    make: false,
    price: false,
    discount: false,
    type: false,
    other: false,
    stock: false,
  });

  const toggleSection = (key: SectionKey) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Build case-insensitive make map while preserving actual vehicle casing when present
  const makeCountsUpper = new Map<string, number>();
  const canonicalMakeByUpper = new Map<string, string>();

  vehicles.forEach((v) => {
    const raw = v.make.trim();
    const upper = raw.toUpperCase();
    makeCountsUpper.set(upper, (makeCountsUpper.get(upper) || 0) + 1);
    if (!canonicalMakeByUpper.has(upper)) {
      canonicalMakeByUpper.set(upper, raw);
    }
  });

  const extraMakes = Array.from(makeCountsUpper.keys()).filter(
    (upper) => !BEFORWARD_MAKES.includes(upper)
  );
  const allDisplayMakes = [...BEFORWARD_MAKES, ...extraMakes.sort()];

  const yardCounts = vehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.yardPort] = (acc[v.yardPort] || 0) + 1;
    return acc;
  }, {});

  const priceBrackets: { id: PriceBracket; label: string; count: number }[] = [
    {
      id: 'under-500',
      label: 'Under $500',
      count: vehicles.filter((v) => matchesPriceBracket(v.fobUsd, 'under-500')).length,
    },
    {
      id: '500-1000',
      label: '$500 - $1,000',
      count: vehicles.filter((v) => matchesPriceBracket(v.fobUsd, '500-1000')).length,
    },
    {
      id: '1000-1500',
      label: '$1,000 - $1,500',
      count: vehicles.filter((v) => matchesPriceBracket(v.fobUsd, '1000-1500')).length,
    },
    {
      id: '1500-2000',
      label: '$1,500 - $2,000',
      count: vehicles.filter((v) => matchesPriceBracket(v.fobUsd, '1500-2000')).length,
    },
    {
      id: '2000-2500',
      label: '$2,000 - $2,500',
      count: vehicles.filter((v) => matchesPriceBracket(v.fobUsd, '2000-2500')).length,
    },
    {
      id: '2500-4000',
      label: '$2,500 - $4,000',
      count: vehicles.filter((v) => matchesPriceBracket(v.fobUsd, '2500-4000')).length,
    },
    {
      id: 'over-4000',
      label: 'Over $4,000',
      count: vehicles.filter((v) => matchesPriceBracket(v.fobUsd, 'over-4000')).length,
    },
  ];

  const discountBrackets: { id: DiscountBracket; label: string; count: number }[] = [
    {
      id: '70-plus',
      label: '70% Off or More',
      count: vehicles.filter((v) => matchesDiscountBracket(v.discountPct, '70-plus')).length,
    },
    {
      id: '60-plus',
      label: '60% Off or More',
      count: vehicles.filter((v) => matchesDiscountBracket(v.discountPct, '60-plus')).length,
    },
    {
      id: '50-plus',
      label: '50% Off or More',
      count: vehicles.filter((v) => matchesDiscountBracket(v.discountPct, '50-plus')).length,
    },
    {
      id: '40-plus',
      label: '40% Off or More',
      count: vehicles.filter((v) => matchesDiscountBracket(v.discountPct, '40-plus')).length,
    },
    {
      id: '30-plus',
      label: '30% Off or More',
      count: vehicles.filter((v) => matchesDiscountBracket(v.discountPct, '30-plus')).length,
    },
    {
      id: '1-30',
      label: '1%-30% Off',
      count: vehicles.filter((v) => matchesDiscountBracket(v.discountPct, '1-30')).length,
    },
  ];

  const specialCategories: {
    id: SpecialFilter;
    label: string;
    icon: typeof Car;
    count: number;
  }[] = [
    {
      id: 'lhd',
      label: 'Left Hand Drive',
      icon: Gauge,
      count: vehicles.filter((v) => matchesSpecialCategory(v, 'lhd')).length,
    },
    {
      id: 'fuel-efficient',
      label: 'Fuel Efficient Vehicles',
      icon: Leaf,
      count: vehicles.filter((v) => matchesSpecialCategory(v, 'fuel-efficient')).length,
    },
    {
      id: 'hybrid',
      label: 'Hybrid',
      icon: Leaf,
      count: vehicles.filter((v) => matchesSpecialCategory(v, 'hybrid')).length,
    },
    {
      id: 'electric',
      label: 'Electric',
      icon: Zap,
      count: vehicles.filter((v) => matchesSpecialCategory(v, 'electric')).length,
    },
    {
      id: 'diesel',
      label: 'Diesel',
      icon: Fuel,
      count: vehicles.filter((v) => matchesSpecialCategory(v, 'diesel')).length,
    },
    {
      id: 'manual',
      label: 'Manual',
      icon: Cog,
      count: vehicles.filter((v) => matchesSpecialCategory(v, 'manual')).length,
    },
    {
      id: 'handicapped',
      label: 'For Handicapped',
      icon: Accessibility,
      count: vehicles.filter((v) => matchesSpecialCategory(v, 'handicapped')).length,
    },
    {
      id: 'salvage',
      label: 'Salvage Cars',
      icon: AlertTriangle,
      count: vehicles.filter((v) => matchesSpecialCategory(v, 'salvage')).length,
    },
  ];

  const hasActive =
    selectedMake !== 'All' ||
    selectedBodyType !== 'All' ||
    priceBracket !== 'all' ||
    discountBracket !== 'all' ||
    specialFilter !== 'all' ||
    selectedStockCountry !== 'All' ||
    selectedYard !== 'All';

  const handleTrigger = (fn: () => void) => {
    fn();
    onItemSelected?.();
  };

  const renderTypeIcon = (kind: 'car' | 'truck' | 'bus' | 'gear') => {
    switch (kind) {
      case 'truck':
        return <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />;
      case 'bus':
        return <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />;
      case 'gear':
        return <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />;
      default:
        return <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <aside aria-label="Vehicle Directory Filters" className="w-full lg:w-64 shrink-0 space-y-3">
      {hasActive && (
        <button
          type="button"
          onClick={() => handleTrigger(onResetAll)}
          className="w-full py-2 px-3 text-xs font-semibold text-[#B91C1C] bg-white border border-[#B91C1C]/35 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          Reset All Sidebar Filters
        </button>
      )}

      {/* 1. Shop By Make */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('make')}
          className="w-full px-3.5 py-2.5 bg-[#0F172A] text-white flex items-center justify-between text-left cursor-pointer"
        >
          <span className="font-display text-xs font-bold tracking-wide">
            Shop By Make
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300 tabular-nums">
            <span>({vehicles.length})</span>
            {collapsed.make ? (
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </span>
        </button>

        {!collapsed.make && (
          <ul className="divide-y divide-slate-100 text-xs">
            <li>
              <button
                type="button"
                onClick={() => handleTrigger(() => onSelectMake('All'))}
                className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  selectedMake === 'All'
                    ? 'bg-red-50/70 font-semibold text-[#B91C1C]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="font-semibold">ALL MAKES</span>
                <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                  ({vehicles.length})
                </span>
              </button>
            </li>
            {allDisplayMakes.map((upperMake) => {
              const count = makeCountsUpper.get(upperMake) || 0;
              const isSelected =
                selectedMake !== 'All' &&
                selectedMake.trim().toUpperCase() === upperMake;
              const targetMakeValue = canonicalMakeByUpper.get(upperMake) || upperMake;
              const monogram = upperMake.slice(0, 2);

              return (
                <li key={upperMake}>
                  <button
                    type="button"
                    onClick={() =>
                      handleTrigger(() =>
                        onSelectMake(isSelected ? 'All' : targetMakeValue)
                      )
                    }
                    className={`w-full px-3.5 py-1.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-red-50/80 font-semibold text-[#B91C1C]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        aria-hidden="true"
                        className={`w-5 h-5 rounded-full border text-[9px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {monogram}
                      </span>
                      <span className="truncate font-medium tracking-tight">
                        {upperMake}
                      </span>
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums shrink-0 ml-2 ${
                        count > 0 ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 2. Shop By Price */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 border-l-[3px] border-l-[#B91C1C] flex items-center justify-between text-left cursor-pointer"
        >
          <span className="font-display text-xs font-bold text-slate-900">
            Shop By Price
          </span>
          {collapsed.price ? (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          )}
        </button>

        {!collapsed.price && (
          <ul className="divide-y divide-slate-100 text-xs">
            {priceBrackets.map((b) => {
              const active = priceBracket === b.id;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleTrigger(() =>
                        onSelectPriceBracket(active ? 'all' : b.id)
                      )
                    }
                    className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-red-50/80 font-semibold text-[#B91C1C]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{b.label}</span>
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        b.count > 0 ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      ({b.count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 3. Shop By Discount */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('discount')}
          className="w-full px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 border-l-[3px] border-l-[#B91C1C] flex items-center justify-between text-left cursor-pointer"
        >
          <span className="font-display text-xs font-bold text-slate-900">
            Shop By Discount
          </span>
          {collapsed.discount ? (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          )}
        </button>

        {!collapsed.discount && (
          <ul className="divide-y divide-slate-100 text-xs">
            {discountBrackets.map((d) => {
              const active = discountBracket === d.id;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleTrigger(() =>
                        onSelectDiscountBracket(active ? 'all' : d.id)
                      )
                    }
                    className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-red-50/80 font-semibold text-[#B91C1C]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Percent className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{d.label}</span>
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        d.count > 0 ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      ({d.count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 4. Shop By Type */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('type')}
          className="w-full px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 border-l-[3px] border-l-[#B91C1C] flex items-center justify-between text-left cursor-pointer"
        >
          <span className="font-display text-xs font-bold text-slate-900">
            Shop By Type
          </span>
          {collapsed.type ? (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          )}
        </button>

        {!collapsed.type && (
          <ul className="divide-y divide-slate-100 text-xs">
            {BODY_TYPES.map((type) => {
              const count = vehicles.filter((v) =>
                matchesBodyTypeFilter(v.bodyType, type.id)
              ).length;
              const active = selectedBodyType === type.id;

              return (
                <li key={type.id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleTrigger(() =>
                        onSelectBodyType(active ? 'All' : type.id)
                      )
                    }
                    className={`w-full px-3.5 py-1.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-red-50/80 font-semibold text-[#B91C1C]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {renderTypeIcon(type.kind)}
                      <span>{type.label}</span>
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        count > 0 ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 5. Other Categories */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('other')}
          className="w-full px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 border-l-[3px] border-l-[#B91C1C] flex items-center justify-between text-left cursor-pointer"
        >
          <span className="font-display text-xs font-bold text-slate-900">
            Other Categories
          </span>
          {collapsed.other ? (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          )}
        </button>

        {!collapsed.other && (
          <ul className="divide-y divide-slate-100 text-xs">
            {specialCategories.map((c) => {
              const Icon = c.icon;
              const active = specialFilter === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleTrigger(() =>
                        onSelectSpecialFilter(active ? 'all' : c.id)
                      )
                    }
                    className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-red-50/80 font-semibold text-[#B91C1C]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{c.label}</span>
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        c.count > 0 ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      ({c.count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 6. Vehicles In Stock */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('stock')}
          className="w-full px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 border-l-[3px] border-l-[#B91C1C] flex items-center justify-between text-left cursor-pointer"
        >
          <span className="font-display text-xs font-bold text-slate-900">
            Vehicles In Stock
          </span>
          {collapsed.stock ? (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          )}
        </button>

        {!collapsed.stock && (
          <ul className="divide-y divide-slate-100 text-xs">
            {STOCK_COUNTRIES.map((country) => {
              const count = vehicles.filter((v) =>
                matchesStockCountry(v, country)
              ).length;
              const active = selectedStockCountry === country;

              return (
                <li key={country}>
                  <button
                    type="button"
                    onClick={() =>
                      handleTrigger(() =>
                        onSelectStockCountry(active ? 'All' : country)
                      )
                    }
                    className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-red-50/80 font-semibold text-[#B91C1C]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{country}</span>
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        count > 0 ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      ({count})
                    </span>
                  </button>

                  {/* Japan Port Sub-Yards */}
                  {country === 'Japan' && (
                    <div className="bg-[#F8F9FA] px-3.5 py-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {JAPAN_YARDS.map((yard) => {
                        const yardActive = selectedYard === yard;
                        const yCount = yardCounts[yard] || 0;
                        return (
                          <button
                            key={yard}
                            type="button"
                            onClick={() =>
                              handleTrigger(() =>
                                onSelectYard(yardActive ? 'All' : yard)
                              )
                            }
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer tabular-nums ${
                              yardActive
                                ? 'bg-[#B91C1C] text-white border-[#B91C1C] font-semibold'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <MapPin className="w-2.5 h-2.5" aria-hidden="true" />
                            <span>
                              {yard} ({yCount})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

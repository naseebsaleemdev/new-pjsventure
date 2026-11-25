import { RotateCcw, Search } from 'lucide-react';
import { BodyType, SteeringSide, Vehicle } from '../types/vehicle';

interface PortalSearchHeroProps {
  vehicles: Vehicle[];
  filteredCount: number;
  selectedMake: string;
  selectedBodyType: BodyType;
  selectedFuel: string;
  selectedSteering: 'All' | SteeringSide;
  yearFrom: string;
  maxFob: string;
  selectedYard: string;
  portBalanceCount: number;
  searchQuery: string;
  onChangeMake: (make: string) => void;
  onChangeBodyType: (bodyType: BodyType) => void;
  onChangeFuel: (fuel: string) => void;
  onChangeSteering: (steering: 'All' | SteeringSide) => void;
  onChangeYearFrom: (year: string) => void;
  onChangeMaxFob: (max: string) => void;
  onChangeYard: (yard: string) => void;
  onOpenPortBalance: () => void;
  onChangeSearchQuery: (q: string) => void;
  onResetFilters: () => void;
}

const POPULAR_MAKES = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Mitsubishi', 'Isuzu'];
const QUICK_BODIES: BodyType[] = [
  'SUV',
  'Sedan',
  'Hatchback',
  'Van / Mini Van',
  'Pickup',
  'Truck',
];

export function PortalSearchHero({
  vehicles,
  filteredCount,
  selectedMake,
  selectedBodyType,
  selectedFuel,
  selectedSteering,
  yearFrom,
  maxFob,
  selectedYard,
  portBalanceCount,
  searchQuery,
  onChangeMake,
  onChangeBodyType,
  onChangeFuel,
  onChangeSteering,
  onChangeYearFrom,
  onChangeMaxFob,
  onChangeYard,
  onOpenPortBalance,
  onChangeSearchQuery,
  onResetFilters,
}: PortalSearchHeroProps) {
  const makes = Array.from(new Set(vehicles.map((v) => v.make)));

  const handleJumpToStock = () => {
    document.getElementById('stock-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-5">
      {/* Multi-Parameter "Search for Cars" Box (SBT Japan / BE FORWARD style) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-200">
          <h2 className="font-display text-base font-bold text-slate-950">
            Search Japan Yard Stock
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenPortBalance}
              className="text-xs font-semibold text-[#B91C1C] hover:underline cursor-pointer tabular-nums"
            >
              Separate Port Balance Cars ({portBalanceCount}) →
            </button>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#B91C1C] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Search</span>
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="search-make" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Make
            </label>
            <select
              id="search-make"
              value={selectedMake}
              onChange={(e) => onChangeMake(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">All Makes</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="search-body" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Body Type
            </label>
            <select
              id="search-body"
              value={selectedBodyType}
              onChange={(e) => onChangeBodyType(e.target.value as BodyType)}
              className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">All Body Types</option>
              {QUICK_BODIES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="search-year" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Year From
            </label>
            <select
              id="search-year"
              value={yearFrom}
              onChange={(e) => onChangeYearFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">Any Year</option>
              <option value="2022">2022 &amp; Newer</option>
              <option value="2021">2021 &amp; Newer</option>
              <option value="2020">2020 &amp; Newer</option>
              <option value="2019">2019 &amp; Newer</option>
            </select>
          </div>

          <div>
            <label htmlFor="search-max-fob" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Max Price (FOB USD)
            </label>
            <select
              id="search-max-fob"
              value={maxFob}
              onChange={(e) => onChangeMaxFob(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">No Budget Limit</option>
              <option value="10000">Up to $10,000</option>
              <option value="20000">Up to $20,000</option>
              <option value="30000">Up to $30,000</option>
              <option value="40000">Up to $40,000</option>
            </select>
          </div>

          <div>
            <label htmlFor="search-fuel" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Fuel Type
            </label>
            <select
              id="search-fuel"
              value={selectedFuel}
              onChange={(e) => onChangeFuel(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">All Fuel Types</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Petrol">Petrol</option>
              <option value="Gasoline">Gasoline</option>
            </select>
          </div>

          <div>
            <label htmlFor="search-steering" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Steering
            </label>
            <select
              id="search-steering"
              value={selectedSteering}
              onChange={(e) => onChangeSteering(e.target.value as 'All' | SteeringSide)}
              className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">All (RHD &amp; LHD)</option>
              <option value="RHD">Right-Hand Drive (RHD)</option>
              <option value="LHD">Left-Hand Drive (LHD)</option>
            </select>
          </div>

          <div>
            <label htmlFor="search-yard-loc" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Japan Export Yard
            </label>
            <select
              id="search-yard-loc"
              value={selectedYard}
              onChange={(e) => onChangeYard(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">All Japan Yards</option>
              <option value="Yokohama">Yokohama Yard</option>
              <option value="Nagoya">Nagoya Yard</option>
              <option value="Kobe">Kobe Yard</option>
              <option value="Hakata">Hakata Yard</option>
              <option value="Osaka">Osaka Yard</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 flex items-end gap-2">
            <div className="flex-1 min-w-0">
              <label htmlFor="search-keyword" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Model or Chassis
              </label>
              <div className="relative">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="search-keyword"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onChangeSearchQuery(e.target.value)}
                  placeholder="Prado, GDJ150W..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#B91C1C]"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleJumpToStock}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums h-[38px]"
            >
              Go ({filteredCount})
            </button>
          </div>
        </div>
      </div>

      {/* Quick Browse by Make & Body Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="font-display text-xs font-bold text-slate-900 mb-3">
            Popular Japanese Makes
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {POPULAR_MAKES.map((make) => {
              const count = vehicles.filter((v) => v.make === make).length;
              const active = selectedMake === make;
              return (
                <button
                  key={make}
                  type="button"
                  onClick={() => onChangeMake(active ? 'All' : make)}
                  className={`px-2.5 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                      : 'bg-[#F8F9FA] text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-semibold truncate">{make}</span>
                  <span
                    className={`block font-mono text-[11px] tabular-nums ${
                      active ? 'text-red-100' : 'text-slate-500'
                    }`}
                  >
                    {count} units
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="font-display text-xs font-bold text-slate-900 mb-3">
            Shop by Body Type
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_BODIES.map((body) => {
              const count = vehicles.filter((v) => v.bodyType === body).length;
              const active = selectedBodyType === body;
              return (
                <button
                  key={body}
                  type="button"
                  onClick={() => onChangeBodyType(active ? 'All' : body)}
                  className={`px-2.5 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-[#F8F9FA] text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-semibold truncate">{body}</span>
                  <span
                    className={`block font-mono text-[11px] tabular-nums ${
                      active ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {count} units
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

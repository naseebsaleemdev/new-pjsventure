import { useState } from 'react';
import {
  ChevronRight,
  GitCompareArrows,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  BodyType,
  DestinationPort,
  PageRoute,
  ShippingMethod,
  SteeringSide,
  Vehicle,
} from '../types/vehicle';
import { PortalSidebar, PriceBracket, SpecialFilter } from './PortalSidebar';
import { VehicleCard } from './VehicleCard';
import { VehicleRowCard } from './VehicleRowCard';

type SortOption = 'fob-asc' | 'fob-desc' | 'year-desc' | 'mileage-asc';

interface UsedCarsPageProps {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  selectedMake: string;
  selectedBodyType: BodyType;
  selectedFuel: string;
  selectedSteering: 'All' | SteeringSide;
  yearFrom: string;
  maxFob: string;
  priceBracket: PriceBracket;
  specialFilter: SpecialFilter;
  portBalanceCount: number;
  selectedYard: string;
  searchQuery: string;
  sortBy: SortOption;
  selectedPort: DestinationPort;
  shippingMethod: ShippingMethod;
  includeInsurance: boolean;
  inquiryList: Vehicle[];
  compareIds: string[];
  onChangeMake: (make: string) => void;
  onChangeBodyType: (body: BodyType) => void;
  onChangeFuel: (fuel: string) => void;
  onChangeSteering: (steering: 'All' | SteeringSide) => void;
  onChangeYearFrom: (year: string) => void;
  onChangeMaxFob: (maxFob: string) => void;
  onChangePriceBracket: (bracket: PriceBracket) => void;
  onChangeSpecialFilter: (filter: SpecialFilter) => void;
  onChangeYard: (yard: string) => void;
  onChangeSearchQuery: (q: string) => void;
  onChangeSortBy: (sort: SortOption) => void;
  onResetFilters: () => void;
  onInspectVehicle: (vehicle: Vehicle) => void;
  onToggleInquiry: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onQuickQuote: (vehicle: Vehicle) => void;
  onNavigate: (route: PageRoute) => void;
}

const BODY_OPTIONS: BodyType[] = [
  'All',
  'SUV',
  'Sedan',
  'Hatchback',
  'Van / Mini Van',
  'Pickup',
  'Truck',
];

export function UsedCarsPage({
  vehicles,
  filteredVehicles,
  selectedMake,
  selectedBodyType,
  selectedFuel,
  selectedSteering,
  yearFrom,
  maxFob,
  priceBracket,
  specialFilter,
  portBalanceCount,
  selectedYard,
  searchQuery,
  sortBy,
  selectedPort,
  shippingMethod,
  includeInsurance,
  inquiryList,
  compareIds,
  onChangeMake,
  onChangeBodyType,
  onChangeFuel,
  onChangeSteering,
  onChangeYearFrom,
  onChangeMaxFob,
  onChangePriceBracket,
  onChangeSpecialFilter,
  onChangeYard,
  onChangeSearchQuery,
  onChangeSortBy,
  onResetFilters,
  onInspectVehicle,
  onToggleInquiry,
  onToggleCompare,
  onQuickQuote,
  onNavigate,
}: UsedCarsPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort();

  const hasActiveFilters =
    selectedMake !== 'All' ||
    selectedBodyType !== 'All' ||
    selectedFuel !== 'All' ||
    selectedSteering !== 'All' ||
    yearFrom !== 'All' ||
    maxFob !== 'All' ||
    priceBracket !== 'all' ||
    specialFilter !== 'all' ||
    selectedYard !== 'All' ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* SBT-Style Breadcrumb & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <button
              type="button"
              onClick={() => onNavigate({ name: 'home' })}
              className="hover:text-[#B91C1C] hover:underline cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span className="font-medium text-slate-900">Used Cars Inventory</span>
            {selectedMake !== 'All' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span className="font-medium text-slate-900">{selectedMake}</span>
              </>
            )}
          </nav>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Japan Yard Used Cars Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified JEVIC &amp; JAAI stock across Yokohama, Nagoya, Kobe, Hakata, and Osaka export yards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onNavigate({ name: 'port-balance' })}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
          >
            Port Balance Cars ({portBalanceCount}) →
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'page', slug: 'chassis-check' })}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            VIN &amp; Chassis Report
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'auction' })}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Request Auction Bidding
          </button>
        </div>
      </div>

      {/* Horizontal Top Inventory Search Matrix (SBT Used-Cars style) */}
      <section
        aria-label="Filter Used Cars Inventory"
        className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div>
            <label htmlFor="uc-make" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Make
            </label>
            <select
              id="uc-make"
              value={selectedMake}
              onChange={(e) => onChangeMake(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
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
            <label htmlFor="uc-body" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Body Type
            </label>
            <select
              id="uc-body"
              value={selectedBodyType}
              onChange={(e) => onChangeBodyType(e.target.value as BodyType)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              {BODY_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b === 'All' ? 'All Body Types' : b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="uc-fuel" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Fuel
            </label>
            <select
              id="uc-fuel"
              value={selectedFuel}
              onChange={(e) => onChangeFuel(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">All Fuels</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label htmlFor="uc-steering" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Steering
            </label>
            <select
              id="uc-steering"
              value={selectedSteering}
              onChange={(e) =>
                onChangeSteering(e.target.value as 'All' | SteeringSide)
              }
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">RHD &amp; LHD</option>
              <option value="RHD">RHD</option>
              <option value="LHD">LHD</option>
            </select>
          </div>

          <div>
            <label htmlFor="uc-year" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Year From
            </label>
            <select
              id="uc-year"
              value={yearFrom}
              onChange={(e) => onChangeYearFrom(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">Any Year</option>
              <option value="2022">2022+</option>
              <option value="2021">2021+</option>
              <option value="2020">2020+</option>
              <option value="2019">2019+</option>
            </select>
          </div>

          <div>
            <label htmlFor="uc-fob" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Max FOB (USD)
            </label>
            <select
              id="uc-fob"
              value={maxFob}
              onChange={(e) => onChangeMaxFob(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">No Limit</option>
              <option value="10000">Under $10,000</option>
              <option value="15000">Under $15,000</option>
              <option value="20000">Under $20,000</option>
              <option value="30000">Under $30,000</option>
            </select>
          </div>

          <div>
            <label htmlFor="uc-yard-type" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Japan Yard
            </label>
            <select
              id="uc-yard-type"
              value={selectedYard}
              onChange={(e) => onChangeYard(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">All Japan Yards</option>
              <option value="Yokohama">Yokohama</option>
              <option value="Nagoya">Nagoya</option>
              <option value="Kobe">Kobe</option>
              <option value="Hakata">Hakata</option>
              <option value="Osaka">Osaka</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              placeholder="Search by stock no., make, model, chassis code (e.g. GDJ150W), or arrival port..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#B91C1C] bg-red-50/70 border border-[#B91C1C]/30 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </section>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileSidebar((prev) => !prev)}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          <span>
            {showMobileSidebar
              ? 'Hide Directory Sidebar'
              : 'Filter by Make, Body Type & FOB Price'}
          </span>
        </button>
      </div>

      {/* Main 2-Column SBT Directory & List Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div
          className={`${
            showMobileSidebar ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 shrink-0`}
        >
          <PortalSidebar
            vehicles={vehicles}
            selectedMake={selectedMake}
            selectedBodyType={selectedBodyType}
            priceBracket={priceBracket}
            specialFilter={specialFilter}
            selectedYard={selectedYard}
            onSelectMake={onChangeMake}
            onSelectBodyType={onChangeBodyType}
            onSelectPriceBracket={onChangePriceBracket}
            onSelectSpecialFilter={onChangeSpecialFilter}
            onSelectYard={onChangeYard}
            onResetAll={onResetFilters}
          />
        </div>

        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Inventory Results Bar */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold text-slate-950 tabular-nums">
                {filteredVehicles.length} Vehicles Found{' '}
                <span className="font-normal text-slate-500">
                  (of {vehicles.length} total export stock)
                </span>
              </p>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5 tabular-nums">
                CIF Destination: {selectedPort.portName}, {selectedPort.country} · {shippingMethod}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {compareIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'compare' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer tabular-nums"
                >
                  <GitCompareArrows className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Compare ({compareIds.length})</span>
                </button>
              )}

              <div className="flex items-center gap-1 p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Grid</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="uc-sort" className="text-xs font-medium text-slate-600">
                  Sort:
                </label>
                <select
                  id="uc-sort"
                  value={sortBy}
                  onChange={(e) => onChangeSortBy(e.target.value as SortOption)}
                  className="px-2.5 py-1.5 text-xs font-medium bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
                >
                  <option value="fob-asc">FOB: Low to High</option>
                  <option value="fob-desc">FOB: High to Low</option>
                  <option value="year-desc">Year: Newest First</option>
                  <option value="mileage-asc">Mileage: Lowest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Results */}
          {filteredVehicles.length > 0 ? (
            viewMode === 'list' ? (
              <div className="space-y-4">
                {filteredVehicles.map((vehicle) => (
                  <VehicleRowCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    selectedPort={selectedPort}
                    shippingMethod={shippingMethod}
                    includeInsurance={includeInsurance}
                    isInInquiry={inquiryList.some((item) => item.id === vehicle.id)}
                    isInCompare={compareIds.includes(vehicle.id)}
                    onInspect={onInspectVehicle}
                    onToggleInquiry={onToggleInquiry}
                    onToggleCompare={onToggleCompare}
                    onQuickQuote={onQuickQuote}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    selectedPort={selectedPort}
                    shippingMethod={shippingMethod}
                    includeInsurance={includeInsurance}
                    isInInquiry={inquiryList.some((item) => item.id === vehicle.id)}
                    isInCompare={compareIds.includes(vehicle.id)}
                    onInspect={onInspectVehicle}
                    onToggleInquiry={onToggleInquiry}
                    onToggleCompare={onToggleCompare}
                    onQuickQuote={onQuickQuote}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
              <p className="font-display text-lg font-bold text-slate-900">
                No vehicles match your current filters
              </p>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Reset filters to view all available yard stock or submit a custom auction request from USS Tokyo, TAA, and HAA Kobe.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset All Filters</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: 'auction' })}
                  className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Request Auction Bidding
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

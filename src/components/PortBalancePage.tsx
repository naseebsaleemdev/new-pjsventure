import { useMemo, useState } from 'react';
import { Anchor, ChevronRight, GitCompareArrows, LayoutGrid, List, Search } from 'lucide-react';
import {
  DestinationPort,
  PageRoute,
  ShippingMethod,
  Vehicle,
} from '../types/vehicle';
import { VehicleCard } from './VehicleCard';
import { VehicleRowCard } from './VehicleRowCard';

interface PortBalancePageProps {
  portBalanceVehicles: Vehicle[];
  selectedPort: DestinationPort;
  shippingMethod: ShippingMethod;
  includeInsurance: boolean;
  inquiryList: Vehicle[];
  compareIds: string[];
  onInspectVehicle: (vehicle: Vehicle) => void;
  onToggleInquiry: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onQuickQuote: (vehicle: Vehicle) => void;
  onNavigate: (route: PageRoute) => void;
}

export function PortBalancePage({
  portBalanceVehicles,
  selectedPort,
  shippingMethod,
  includeInsurance,
  inquiryList,
  compareIds,
  onInspectVehicle,
  onToggleInquiry,
  onToggleCompare,
  onQuickQuote,
  onNavigate,
}: PortBalancePageProps) {
  const [selectedPortName, setSelectedPortName] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'at-port' | 'in-transit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const destinationPorts = useMemo(
    () =>
      Array.from(
        new Set(
          portBalanceVehicles
            .map((v) => v.portBalancePort)
            .filter((p): p is string => Boolean(p))
        )
      ).sort(),
    [portBalanceVehicles]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return portBalanceVehicles.filter((v) => {
      if (selectedPortName !== 'All' && v.portBalancePort !== selectedPortName) {
        return false;
      }
      if (
        statusFilter === 'at-port' &&
        v.stockLocation !== 'Port Balance (At Port)'
      ) {
        return false;
      }
      if (
        statusFilter === 'in-transit' &&
        v.stockLocation !== 'Port Balance (In Transit)'
      ) {
        return false;
      }
      if (q) {
        const hay =
          `${v.make} ${v.model} ${v.trim} ${v.stockNo} ${v.chassisCode} ${v.portBalancePort || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [portBalanceVehicles, selectedPortName, statusFilter, searchQuery]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"
          >
            <button
              type="button"
              onClick={() => onNavigate({ name: 'home' })}
              className="hover:text-[#B91C1C] hover:underline cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span className="font-medium text-slate-900">Port Balance Cars</span>
          </nav>
          <div className="flex items-center gap-2.5">
            <Anchor className="w-6 h-6 text-[#B91C1C] shrink-0" aria-hidden="true" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Dedicated Port Balance Inventory
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Separate from Japan yard stock: these units are already landed at destination ports or currently in marine transit. Reserve with a Booking Deposit and settle the remaining Port Balance upon arrival.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate({ name: 'used-cars' })}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Browse Japan Yard Stock →
          </button>
        </div>
      </div>

      {/* Port Balance Filter Bar */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label htmlFor="pb-port" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Destination Port
            </label>
            <select
              id="pb-port"
              value={selectedPortName}
              onChange={(e) => setSelectedPortName(e.target.value)}
              className="px-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
            >
              <option value="All">All Port Balance Ports ({portBalanceVehicles.length})</option>
              {destinationPorts.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-600 mb-1">
              Arrival Stage
            </span>
            <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
              {(
                [
                  { id: 'all', label: 'All Units' },
                  { id: 'at-port', label: 'At Port Ready' },
                  { id: 'in-transit', label: 'In Transit' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatusFilter(opt.id)}
                  className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === opt.id
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Model, stock no, port..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F9FA] border border-slate-300 rounded-lg focus:outline-none focus:border-[#B91C1C]"
            />
          </div>

          {compareIds.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate({ name: 'compare' })}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer tabular-nums"
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
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </section>

      {/* Results List */}
      {filtered.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-4">
            {filtered.map((vehicle) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((vehicle) => (
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
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <p className="font-display text-lg font-bold text-slate-900">
            No Port Balance vehicles match your selected filter
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedPortName('All');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg cursor-pointer"
          >
            Show All Port Balance Units
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  Camera,
  Car,
  Check,
  GitCompareArrows,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { calculateVehicleCif } from '../data/ports';
import { DestinationPort, ShippingMethod, Vehicle } from '../types/vehicle';

interface VehicleRowCardProps {
  vehicle: Vehicle;
  selectedPort: DestinationPort;
  shippingMethod: ShippingMethod;
  includeInsurance: boolean;
  isInInquiry: boolean;
  isInCompare: boolean;
  onInspect: (vehicle: Vehicle) => void;
  onToggleInquiry: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onQuickQuote: (vehicle: Vehicle) => void;
}

export function VehicleRowCard({
  vehicle,
  selectedPort,
  shippingMethod,
  includeInsurance,
  isInInquiry,
  isInCompare,
  onInspect,
  onToggleInquiry,
  onToggleCompare,
  onQuickQuote,
}: VehicleRowCardProps) {
  const [imgError, setImgError] = useState(false);
  const cif = calculateVehicleCif(
    vehicle,
    selectedPort,
    shippingMethod,
    includeInsurance
  );
  const photoCount = vehicle.galleryImages?.length || 1;
  const isPortBalance =
    vehicle.availability === 'Port Balance' && Boolean(vehicle.portBalancePort);

  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col md:flex-row hover:border-slate-300 hover:shadow-sm transition-all duration-150">
      {/* Left: Vehicle Thumbnail (4:3 on mobile, fixed 240-264px on desktop) */}
      <button
        type="button"
        onClick={() => onInspect(vehicle)}
        aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        className="relative w-full md:w-60 lg:w-64 aspect-[4/3] md:aspect-auto md:min-h-[196px] bg-slate-100 overflow-hidden shrink-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#B91C1C]"
      >
        {!imgError ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 p-4 text-center">
            <Car className="w-9 h-9 mb-2 text-slate-400" aria-hidden="true" />
            <span className="font-display text-sm font-semibold text-slate-700">
              {vehicle.make} {vehicle.model}
            </span>
            <span className="font-mono text-xs text-slate-500 mt-0.5">
              {vehicle.stockNo}
            </span>
          </div>
        )}

        <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/75 text-white font-mono text-[11px] tabular-nums">
          <Camera className="w-3 h-3" aria-hidden="true" />
          <span>{photoCount}</span>
        </span>
      </button>

      {/* Center: SBT-Style Title, Spec Matrix & Equipment Line */}
      <div className="flex-1 min-w-0 p-4 flex flex-col justify-between gap-3">
        <div>
          {/* Top Metadata Line (Unboxed) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
            <span className="tabular-nums">
              Stock ID <strong className="text-slate-800">{vehicle.stockNo}</strong>
              {' · '}
              {vehicle.yardPort} Yard
              {' · '}
              {vehicle.inspectionAgency}
            </span>
            <span className="font-semibold text-slate-700 tabular-nums">
              {isPortBalance
                ? `${vehicle.stockLocation || 'Port Balance'} · ${vehicle.portBalancePort}`
                : `Auction Grade ${vehicle.auctionGrade} (${vehicle.exteriorGrade}/${vehicle.interiorGrade})`}
            </span>
          </div>

          {/* Vehicle Headline & Trim */}
          <h3 className="mt-1 font-display text-lg font-bold text-slate-950 leading-snug">
            <button
              type="button"
              onClick={() => onInspect(vehicle)}
              className="text-left hover:text-[#B91C1C] hover:underline underline-offset-2 transition-colors cursor-pointer"
            >
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
            </button>
          </h3>

          {/* 6-Cell Primary Spec Strip */}
          <dl className="mt-2.5 grid grid-cols-3 sm:grid-cols-6 gap-2 py-2.5 px-3 bg-[#F8F9FA] border border-slate-200/80 rounded-lg text-xs">
            <div>
              <dt className="text-[11px] text-slate-500">Mileage</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                {vehicle.mileageKm.toLocaleString()} km
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">Reg. Year</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                {vehicle.year}/{String(vehicle.month).padStart(2, '0')}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">Engine</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                {vehicle.engineCc.toLocaleString()} cc
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">Trans</dt>
              <dd className="font-medium text-slate-900">{vehicle.transmission}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">Fuel</dt>
              <dd className="font-medium text-slate-900">{vehicle.fuel}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-500">Steering</dt>
              <dd className="font-medium text-slate-900">{vehicle.steering}</dd>
            </div>
          </dl>
        </div>

        {/* Secondary Export Specs + Features Line */}
        <div className="space-y-1.5 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
            <span>
              Chassis:{' '}
              <strong className="font-mono text-slate-900">{vehicle.chassisCode}</strong>
            </span>
            <span>
              Drive: <strong className="text-slate-900">{vehicle.drive}</strong>
            </span>
            <span>
              Color: <strong className="text-slate-900">{vehicle.color}</strong>
            </span>
            <span>
              Volume:{' '}
              <strong className="font-mono text-slate-900 tabular-nums">
                {vehicle.m3Volume} m³
              </strong>
            </span>
            <span>
              Seats/Doors:{' '}
              <strong className="font-mono text-slate-900 tabular-nums">
                {vehicle.seats}/{vehicle.doors}
              </strong>
            </span>
          </div>

          <p className="text-[11px] text-slate-500 truncate">
            {vehicle.features.join(' · ')}
          </p>
        </div>
      </div>

      {/* Right: Pricing & Action Column */}
      <div className="md:w-56 lg:w-60 shrink-0 bg-[#F8F9FA] border-t md:border-t-0 md:border-l border-slate-200 p-4 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between md:block">
            <span className="text-[11px] font-medium text-slate-500">
              FOB Price ({vehicle.yardPort})
            </span>
            <p className="font-mono text-xl font-bold text-slate-950 tabular-nums">
              ${vehicle.fobUsd.toLocaleString()}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between md:block">
            <span className="text-[11px] font-medium text-slate-500 block truncate">
              {isPortBalance
                ? `Port Balance (${vehicle.portBalancePort})`
                : `Total CIF (${selectedPort.portName})`}
            </span>
            <p className="font-mono text-lg font-bold text-[#B91C1C] tabular-nums">
              $
              {(isPortBalance && vehicle.depositUsd && vehicle.portBalanceUsd
                ? vehicle.depositUsd + vehicle.portBalanceUsd
                : cif.totalCifUsd
              ).toLocaleString()}
            </p>
            {isPortBalance && vehicle.depositUsd && vehicle.portBalanceUsd ? (
              <p className="font-mono text-[11px] text-slate-600 tabular-nums mt-0.5">
                Dep ${vehicle.depositUsd.toLocaleString()} / Bal ${vehicle.portBalanceUsd.toLocaleString()}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-0.5">
                {shippingMethod} · {selectedPort.transitDays}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onQuickQuote(vehicle)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Inquire Now</span>
          </button>

          <button
            type="button"
            onClick={() => onInspect(vehicle)}
            className="w-full py-1.5 px-3 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            View Details &amp; Specs
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onToggleInquiry(vehicle)}
              className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-semibold border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                isInInquiry
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 hover:text-slate-950 border-slate-200'
              }`}
            >
              {isInInquiry ? (
                <>
                  <Check className="w-3 h-3" aria-hidden="true" />
                  <span>In Quote</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" aria-hidden="true" />
                  <span>Quote</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(vehicle)}
              className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-semibold border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                isInCompare
                  ? 'bg-[#B91C1C]/10 text-[#B91C1C] border-[#B91C1C]'
                  : 'bg-white text-slate-600 hover:text-slate-950 border-slate-200'
              }`}
            >
              <GitCompareArrows className="w-3 h-3" aria-hidden="true" />
              <span>{isInCompare ? 'Added' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

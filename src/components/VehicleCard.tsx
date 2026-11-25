import { useState } from 'react';
import { Car, Check, GitCompareArrows, MessageSquare, Plus } from 'lucide-react';
import { calculateVehicleCif } from '../data/ports';
import { DestinationPort, ShippingMethod, Vehicle } from '../types/vehicle';

interface VehicleCardProps {
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

export function VehicleCard({
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
}: VehicleCardProps) {
  const [imgError, setImgError] = useState(false);
  const cif = calculateVehicleCif(vehicle, selectedPort, shippingMethod, includeInsurance);
  const photoCount = vehicle.galleryImages?.length || 1;

  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      {/* 4:3 Photo Frame */}
      <button
        type="button"
        onClick={() => onInspect(vehicle)}
        className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#B91C1C]"
        aria-label={`Inspect ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
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
      </button>

      {/* Listing Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3.5">
        <div>
          {/* Stock Ref & Yard Metadata (Unboxed) */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
            <span className="tabular-nums">
              {vehicle.stockNo} · {vehicle.yardPort}
              {photoCount > 1 ? ` · ${photoCount} photos` : ''}
            </span>
            <span className="font-semibold text-slate-700 tabular-nums">
              Grade {vehicle.auctionGrade}
            </span>
          </div>

          {/* Vehicle Title */}
          <h3 className="mt-1.5 font-display text-base font-bold text-slate-950 leading-snug">
            <button
              type="button"
              onClick={() => onInspect(vehicle)}
              className="text-left hover:text-[#B91C1C] transition-colors cursor-pointer"
            >
              {vehicle.year} {vehicle.make} {vehicle.model}
            </button>
          </h3>
          <p className="text-xs text-slate-600 truncate">{vehicle.trim}</p>

          {/* Compact Export Spec Table */}
          <dl className="mt-3 grid grid-cols-3 gap-x-2 gap-y-1.5 py-2.5 border-y border-slate-100 text-[11px]">
            <div>
              <dt className="text-slate-400">Mileage</dt>
              <dd className="font-mono font-medium text-slate-800 tabular-nums">
                {vehicle.mileageKm.toLocaleString()} km
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Engine</dt>
              <dd className="font-mono font-medium text-slate-800 tabular-nums">
                {vehicle.engineCc.toLocaleString()} cc
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Fuel</dt>
              <dd className="font-medium text-slate-800">{vehicle.fuel}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Trans</dt>
              <dd className="font-medium text-slate-800">{vehicle.transmission}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Drive</dt>
              <dd className="font-medium text-slate-800">
                {vehicle.drive} · {vehicle.steering}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Chassis</dt>
              <dd className="font-mono font-medium text-slate-800 truncate">
                {vehicle.chassisCode.split('-')[0]}
              </dd>
            </div>
          </dl>
        </div>

        {/* FOB + Live CIF / Port Balance Pricing & Actions */}
        <div>
          {vehicle.availability === 'Port Balance' && vehicle.portBalancePort ? (
            <div className="mb-2.5 pb-2 border-b border-slate-100 flex items-center justify-between gap-2 text-[11px]">
              <span className="font-semibold text-[#B91C1C]">
                {vehicle.stockLocation || 'Port Balance'} · {vehicle.portBalancePort}
              </span>
              {vehicle.depositUsd && vehicle.portBalanceUsd && (
                <span className="font-mono text-slate-600 tabular-nums">
                  Dep ${vehicle.depositUsd.toLocaleString()} / Bal ${vehicle.portBalanceUsd.toLocaleString()}
                </span>
              )}
            </div>
          ) : null}

          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="block text-[11px] text-slate-500">FOB Price</span>
              <span className="font-mono text-lg font-bold text-slate-950 tabular-nums">
                ${vehicle.fobUsd.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[11px] text-slate-500 truncate max-w-[155px]">
                {vehicle.availability === 'Port Balance' && vehicle.portBalancePort
                  ? `Port Balance (${vehicle.portBalancePort})`
                  : `Total CIF (${selectedPort.portName})`}
              </span>
              <span className="font-mono text-base font-bold text-[#B91C1C] tabular-nums">
                $
                {(vehicle.availability === 'Port Balance' &&
                vehicle.depositUsd &&
                vehicle.portBalanceUsd
                  ? vehicle.depositUsd + vehicle.portBalanceUsd
                  : cif.totalCifUsd
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onInspect(vehicle)}
              className="px-2.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Inspect &amp; CIF
            </button>
            <button
              type="button"
              onClick={() => onQuickQuote(vehicle)}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Send Inquiry</span>
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onToggleInquiry(vehicle)}
              className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-semibold border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                isInInquiry
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 hover:text-slate-950 border-slate-200 hover:border-slate-300'
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
                  <span>Add Quote</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(vehicle)}
              className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-semibold border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                isInCompare
                  ? 'bg-[#B91C1C]/10 text-[#B91C1C] border-[#B91C1C]'
                  : 'text-slate-600 hover:text-slate-950 border-slate-200 hover:border-slate-300'
              }`}
            >
              <GitCompareArrows className="w-3 h-3" aria-hidden="true" />
              <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

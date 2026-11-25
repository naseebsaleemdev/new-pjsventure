import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Ship,
} from 'lucide-react';
import { calculateVehicleCif } from '../data/ports';
import { HERO_PORT_IMAGE } from '../data/vehicles';
import { DestinationPort, ShippingMethod, Vehicle } from '../types/vehicle';

interface HeroSliderProps {
  vehicles: Vehicle[];
  selectedPort: DestinationPort;
  shippingMethod: ShippingMethod;
  includeInsurance: boolean;
  onInspectVehicle: (vehicle: Vehicle) => void;
  onRequestAuction: () => void;
}

interface SlideItem {
  id: string;
  kicker: string;
  headline: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  vehicle?: Vehicle;
  specs: { label: string; value: string }[];
}

export function HeroSlider({
  vehicles,
  selectedPort,
  shippingMethod,
  includeInsurance,
  onInspectVehicle,
  onRequestAuction,
}: HeroSliderProps) {
  const prado = vehicles.find((v) => v.id === 'pjv-prado-2022') ?? vehicles[0];
  const alphard = vehicles.find((v) => v.id === 'pjv-alphard-2021') ?? vehicles[1];
  const hilux = vehicles.find((v) => v.id === 'pjv-hilux-2022') ?? vehicles[2];

  const slides: SlideItem[] = [
    {
      id: 'port-terminal',
      kicker: 'Pjs Venture Co., Ltd. · Yokohama · Nagoya · Kobe · Hakata',
      headline: 'Direct Japanese Vehicle Exports, Inspected & Shipped Worldwide',
      description:
        'Source auction-grade SUVs, executive vans, hybrids, and commercial trucks directly from Japan with verified JEVIC/JAAI inspection and transparent port-to-port CIF rates.',
      imageUrl: HERO_PORT_IMAGE,
      imageAlt: 'Pjs Venture export vehicles staged at Yokohama deep-water Ro-Ro terminal',
      specs: [
        { label: 'Yard Stock', value: `${vehicles.length} Units Ready` },
        { label: 'Inspection', value: 'JEVIC / JAAI' },
        { label: 'Dispatch Avg', value: '14 Days' },
        { label: 'Active Port', value: selectedPort.portName },
      ],
    },
    ...(prado
      ? [
          {
            id: prado.id,
            kicker: `Featured SUV · Stock ${prado.stockNo} · ${prado.yardPort} Yard · Grade ${prado.auctionGrade}`,
            headline: `${prado.year} ${prado.make} ${prado.model} ${prado.trim}`,
            description:
              'One-owner Tokyo registration with 2.8L turbo-diesel 4WD, tan leather 7-seat cabin, 360-degree camera, and full dealer service history.',
            imageUrl: prado.imageUrl,
            imageAlt: `${prado.year} ${prado.make} ${prado.model} ${prado.trim}`,
            vehicle: prado,
            specs: [
              { label: 'Chassis', value: prado.chassisCode.split('-')[0] },
              { label: 'Mileage', value: `${prado.mileageKm.toLocaleString()} km` },
              { label: 'FOB Price', value: `$${prado.fobUsd.toLocaleString()}` },
              {
                label: `CIF ${selectedPort.portName}`,
                value: `$${calculateVehicleCif(prado, selectedPort, shippingMethod, includeInsurance).totalCifUsd.toLocaleString()}`,
              },
            ],
          },
        ]
      : []),
    ...(alphard
      ? [
          {
            id: alphard.id,
            kicker: `Executive Minivan · Stock ${alphard.stockNo} · ${alphard.yardPort} Yard · Grade ${alphard.auctionGrade}`,
            headline: `${alphard.year} ${alphard.make} ${alphard.model} ${alphard.trim}`,
            description:
              'Grade 5.0 executive chauffeur MPV featuring power ottoman captain chairs, twin moonroofs, dual power sliding doors, and JEVIC certification.',
            imageUrl: alphard.imageUrl,
            imageAlt: `${alphard.year} ${alphard.make} ${alphard.model} ${alphard.trim}`,
            vehicle: alphard,
            specs: [
              { label: 'Chassis', value: alphard.chassisCode.split('-')[0] },
              { label: 'Mileage', value: `${alphard.mileageKm.toLocaleString()} km` },
              { label: 'FOB Price', value: `$${alphard.fobUsd.toLocaleString()}` },
              {
                label: `CIF ${selectedPort.portName}`,
                value: `$${calculateVehicleCif(alphard, selectedPort, shippingMethod, includeInsurance).totalCifUsd.toLocaleString()}`,
              },
            ],
          },
        ]
      : []),
    ...(hilux
      ? [
          {
            id: hilux.id,
            kicker: `4WD Double-Cab · Stock ${hilux.stockNo} · ${hilux.yardPort} Yard · Grade ${hilux.auctionGrade}`,
            headline: `${hilux.year} ${hilux.make} ${hilux.model} ${hilux.trim}`,
            description:
              'Black Rally Edition 4WD diesel pickup equipped with differential lock, all-terrain tires, heavy-duty bedliner, and QISJ export verification.',
            imageUrl: hilux.imageUrl,
            imageAlt: `${hilux.year} ${hilux.make} ${hilux.model} ${hilux.trim}`,
            vehicle: hilux,
            specs: [
              { label: 'Chassis', value: hilux.chassisCode.split('-')[0] },
              { label: 'Mileage', value: `${hilux.mileageKm.toLocaleString()} km` },
              { label: 'FOB Price', value: `$${hilux.fobUsd.toLocaleString()}` },
              {
                label: `CIF ${selectedPort.portName}`,
                value: `$${calculateVehicleCif(hilux, selectedPort, shippingMethod, includeInsurance).totalCifUsd.toLocaleString()}`,
              },
            ],
          },
        ]
      : []),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  const currentSlide = slides[activeIndex] ?? slides[0];

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handleBrowseInventory = () => {
    document.getElementById('stock-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRequestAuction = () => {
    onRequestAuction();
  };

  return (
    <section
      aria-label="Featured Export Inventory Slider"
      className="relative w-full bg-slate-950 border-b border-slate-800 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background Slide Layers (Crossfade via Opacity only) */}
      <div className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;
          const hasError = failedImages[slide.id];
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {!hasError ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({ ...prev, [slide.id]: true }))
                  }
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                  <Ship className="w-16 h-16 text-slate-700" aria-hidden="true" />
                </div>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/75 to-slate-950/30"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30"
              />
            </div>
          );
        })}

        {/* Foreground Content Container */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium tracking-wide text-slate-300">
              {currentSlide.kicker}
            </p>

            <h1 className="mt-2.5 font-display text-2xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-white leading-[1.12] [text-wrap:balance]">
              {currentSlide.headline}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              {currentSlide.description}
            </p>

            {/* Tabular Quick Spec Strip */}
            <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 px-4 bg-slate-950/65 backdrop-blur-xs border border-white/15 rounded-xl max-w-xl">
              {currentSlide.specs.map((spec) => (
                <div key={spec.label} className="min-w-0">
                  <dt className="text-[11px] text-slate-400 truncate">
                    {spec.label}
                  </dt>
                  <dd className="font-mono text-sm font-semibold text-white tabular-nums truncate mt-0.5">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Primary & Secondary CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBrowseInventory}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleRequestAuction}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Gavel className="w-4 h-4 text-[#B91C1C]" aria-hidden="true" />
                <span>Request Auction Access</span>
              </button>

              {currentSlide.vehicle && (
                <button
                  type="button"
                  onClick={() => onInspectVehicle(currentSlide.vehicle!)}
                  className="px-4 py-3 text-sm font-semibold text-white hover:text-slate-200 underline underline-offset-4 decoration-white/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Inspect Unit Specs
                </button>
              )}
            </div>
          </div>

          {/* Bottom Slider Controls & Slide Selectors */}
          <div className="mt-8 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Choose slide">
              {slides.map((slide, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white text-slate-950 font-semibold'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    {slide.vehicle
                      ? `${slide.vehicle.make} ${slide.vehicle.model}`
                      : 'Yokohama Terminal'}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-300 tabular-nums mr-1">
                0{activeIndex + 1} / 0{slides.length}
              </span>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous slide"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next slide"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

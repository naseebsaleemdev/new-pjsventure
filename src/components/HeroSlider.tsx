import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Pause,
  Play,
  Ship,
} from 'lucide-react';
import { HERO_PORT_IMAGE } from '../data/vehicles';
import { DestinationPort } from '../types/vehicle';

interface HeroSliderProps {
  selectedPort: DestinationPort;
  onRequestAuction: () => void;
}

interface BannerSlide {
  id: string;
  label: string;
  kicker: string;
  headline: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export function HeroSlider({
  selectedPort,
  onRequestAuction,
}: HeroSliderProps) {
  const slides: BannerSlide[] = [
    {
      id: 'yokohama-terminal',
      label: 'Yokohama Terminal',
      kicker: `Pjs Venture Co., Ltd. · Yokohama · Nagoya · Kobe · Active Port: ${selectedPort.portName}`,
      headline: 'Direct Japanese Vehicle Exports, Inspected & Shipped Worldwide',
      description:
        'Port-side export yards across Japan with scheduled weekly ocean dispatch and transparent CIF freight to global destinations.',
      imageUrl: HERO_PORT_IMAGE,
      imageAlt: 'Yokohama deep-water Ro-Ro vehicle export terminal and ocean carrier ship',
    },
    {
      id: 'roro-freight',
      label: 'Ocean Ro-Ro Freight',
      kicker: 'Scheduled Deep-Sea Voyages · Dedicated Ro-Ro & 20ft Container Lines',
      headline: 'Reliable Maritime Logistics From Japan to Over 90 Global Ports',
      description:
        'Secured deck space on major roll-on/roll-off car carriers with marine transit coverage and live port documentation tracking.',
      imageUrl: '/src/assets/images/hero_roro_vessel_1795612263313.jpg',
      imageAlt: 'Deep-sea Ro-Ro ocean carrier cargo vessel sailing across calm Pacific waters at sunset',
    },
    {
      id: 'pre-export-inspection',
      label: 'JEVIC & JAAI Inspection',
      kicker: 'Certified Export Compliance · Radiation · Odometer · Structural Audit',
      headline: 'Verified Pre-Export Inspection Before Every Vessel Departure',
      description:
        'Independent JEVIC, JAAI, and QISJ clearance checks ensure strict destination compliance before your shipment leaves Japan.',
      imageUrl: '/src/assets/images/hero_export_inspection_1795612263493.jpg',
      imageAlt: 'Certified Japanese automotive pre-export inspection facility in Yokohama',
    },
    {
      id: 'nagoya-container-port',
      label: 'Auction & Port Dispatch',
      kicker: 'Direct USS · TAA · HAA Auction Access · Nagoya Container Terminal',
      headline: 'Fast Customs Clearance & Export Documentation Under One Roof',
      description:
        'From Japanese auction floor bidding to Export Certificate deregistration and Bill of Lading courier dispatch.',
      imageUrl: '/src/assets/images/hero_container_logistics_1795612264707.jpg',
      imageAlt: 'Nagoya deep-water international maritime container and freight shipping port',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const touchStartXRef = useRef<number | null>(null);

  const isPaused = isHovered || isManualPaused;

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

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
    }, 5500);

    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  const currentSlide = slides[activeIndex] ?? slides[0];

  const handleBrowseInventory = () => {
    document.getElementById('stock-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;
    const endX = e.changedTouches[0]?.clientX;
    if (typeof endX !== 'number') return;
    const delta = endX - startX;
    if (Math.abs(delta) < 42) return;
    if (delta > 0) {
      goPrev();
    } else {
      goNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <section
      aria-label="Pjs Venture Export Showcase Slider"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="relative w-full bg-slate-950 border-b border-slate-800 overflow-hidden focus:outline-none"
    >
      <div className="relative min-h-[340px] sm:min-h-[410px] lg:min-h-[470px] flex items-end">
        {/* Background Widescreen Image Slides */}
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;
          const hasError = failedImages[slide.id];
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
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
                  className={`w-full h-full object-cover object-center transition-transform duration-1000 ease-out ${
                    isActive ? 'scale-100' : 'scale-[1.03]'
                  }`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                  <Ship className="w-16 h-16 text-slate-700" aria-hidden="true" />
                </div>
              )}

              {/* Contrast Scrims for Legibility while Preserving Clear Photography */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/15"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/25 to-transparent"
              />
            </div>
          );
        })}

        {/* Floating Edge Arrows (Desktop / Tablet) */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous banner slide"
          className="hidden md:flex items-center justify-center absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/55 hover:bg-slate-950/85 text-white border border-white/20 backdrop-blur-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next banner slide"
          className="hidden md:flex items-center justify-center absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/55 hover:bg-slate-950/85 text-white border border-white/20 backdrop-blur-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Foreground Editorial Copy & Thumbnail Controls */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 pt-16 pb-6 lg:pb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-slate-200/90">
              {currentSlide.kicker}
            </p>

            <h1 className="mt-2 font-display text-2xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-white leading-[1.12] [text-wrap:balance]">
              {currentSlide.headline}
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              {currentSlide.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBrowseInventory}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onRequestAuction}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-950/55 hover:bg-slate-950/80 border border-white/25 rounded-lg backdrop-blur-xs transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Gavel className="w-4 h-4 text-slate-200" aria-hidden="true" />
                <span>Request Auction Access</span>
              </button>
            </div>
          </div>

          {/* Bottom Image Thumbnail & Indicator Strip */}
          <div className="mt-7 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
            {/* Desktop Thumbnail Previews */}
            <div
              className="hidden sm:flex items-center gap-2.5 overflow-x-auto"
              role="tablist"
              aria-label="Choose showcase slide"
            >
              {slides.map((slide, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveIndex(idx)}
                    className={`group flex items-center gap-2.5 pr-3 pl-1.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white/15 border-white/60 text-white'
                        : 'bg-slate-950/45 border-white/15 text-slate-300 hover:bg-slate-950/70 hover:text-white'
                    }`}
                  >
                    <span className="w-11 h-7 rounded overflow-hidden bg-slate-800 shrink-0 block">
                      {!failedImages[slide.id] ? (
                        <img
                          src={slide.imageUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center">
                          <Ship className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-medium">{slide.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Dot Indicators */}
            <div className="flex sm:hidden items-center gap-2" role="tablist" aria-label="Choose showcase slide">
              {slides.map((slide, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={slide.label}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      active ? 'w-7 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/65'
                    }`}
                  />
                );
              })}
            </div>

            {/* Counter + Pause / Mobile Prev-Next */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-xs text-slate-200 tabular-nums mr-1">
                0{activeIndex + 1} / 0{slides.length}
              </span>
              <button
                type="button"
                onClick={() => setIsManualPaused((prev) => !prev)}
                aria-label={isManualPaused ? 'Resume slideshow' : 'Pause slideshow'}
                title={isManualPaused ? 'Resume slideshow' : 'Pause slideshow'}
                className="p-2 rounded-lg bg-slate-950/55 hover:bg-slate-950/85 text-white border border-white/20 transition-colors cursor-pointer"
              >
                {isManualPaused ? (
                  <Play className="w-3.5 h-3.5" />
                ) : (
                  <Pause className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous slide"
                className="md:hidden p-2 rounded-lg bg-slate-950/55 hover:bg-slate-950/85 text-white border border-white/20 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next slide"
                className="md:hidden p-2 rounded-lg bg-slate-950/55 hover:bg-slate-950/85 text-white border border-white/20 transition-colors cursor-pointer"
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

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface ClientReview {
  id: string;
  buyerName: string;
  role: string;
  company: string;
  destination: string;
  vehicleBought: string;
  rating: number;
  date: string;
  quote: string;
}

const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    buyerName: 'Samuel Ochieng',
    role: 'Managing Director',
    company: 'Savannah Horizon Motors',
    destination: 'Mombasa, Kenya',
    vehicleBought: '2022 Toyota Land Cruiser Prado TX-L',
    rating: 5,
    date: 'October 2026',
    quote:
      'Before working with Pjs Venture, local brokers added unpredictable port fees after shipment. Their Yokohama team locked our exact CIF Mombasa rate on the Proforma Invoice, completed QISJ inspection in 4 days, and delivered the unit cleanly in 24 days.',
  },
  {
    id: 'rev-2',
    buyerName: 'Andre Campbell',
    role: 'Fleet Procurement Lead',
    company: 'Kingston Auto Imports Ltd.',
    destination: 'Kingston, Jamaica',
    vehicleBought: '2022 Honda Vezel e:HEV + 2019 Toyota Vitz',
    rating: 5,
    date: 'October 2026',
    quote:
      'We used to wait weeks for auction sheet translations from previous exporters. Pjs Venture sent full English USS Tokyo inspection sheets and undercarriage photos within hours, cutting our landed cost by nearly $1,400 per unit.',
  },
  {
    id: 'rev-3',
    buyerName: 'Amina Hassan',
    role: 'Operations Manager',
    company: 'Dar Transit & Logistics',
    destination: 'Dar es Salaam, Tanzania',
    vehicleBought: '2020 Toyota Hiace Van 2.8D',
    rating: 5,
    date: 'September 2026',
    quote:
      'Commercial diesel vans often arrive with tampered odometers when bought blind. Pjs Venture provided verified JEVIC mileage certificates before loading at Hakata Port, and our DHL Original Bill of Lading arrived 10 days before vessel berthing.',
  },
  {
    id: 'rev-4',
    buyerName: 'Tariq Al-Mansoor',
    role: 'General Manager',
    company: 'Gulf Horizon Trading LLC',
    destination: 'Jebel Ali (Dubai), UAE',
    vehicleBought: '2021 Toyota Alphard Executive',
    rating: 5,
    date: 'September 2026',
    quote:
      'Sourcing Grade 5.0 executive MPVs in a tight timeframe was difficult until we switched to Pjs Venture. They secured our Pearl White Alphard at USS Tokyo, handled 20ft container stuffing in Yokohama, and matched every inspection note.',
  },
  {
    id: 'rev-5',
    buyerName: 'Rohan Perera',
    role: 'Director',
    company: 'Lanka Premier Automobiles',
    destination: 'Colombo, Sri Lanka',
    vehicleBought: '2021 Toyota Harrier Hybrid E-Four',
    rating: 5,
    date: 'August 2026',
    quote:
      'Strict hybrid age and battery rules used to delay our Colombo clearances. Pjs Venture ran a full 94% state-of-health hybrid diagnostic at Nagoya yard prior to Ro-Ro booking, letting our unit clear customs in 48 hours.',
  },
  {
    id: 'rev-6',
    buyerName: 'David Ndlovu',
    role: 'Import Coordinator',
    company: 'Southern Cross Fleet Supply',
    destination: 'Durban, South Africa',
    vehicleBought: '2022 Toyota Hilux Z 4WD',
    rating: 5,
    date: 'August 2026',
    quote:
      'Previous suppliers missed SABS paperwork deadlines at Durban port. Pjs Venture coordinated Kobe Ro-Ro scheduling and complete deregistration certificates upfront, saving us three weeks of port storage charges.',
  },
];

export function ClientTrustCarousel() {
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(CLIENT_REVIEWS.length / itemsPerPage);

  const visibleReviews = CLIENT_REVIEWS.slice(
    pageIndex * itemsPerPage,
    pageIndex * itemsPerPage + itemsPerPage
  );

  const handlePrev = () => {
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setPageIndex((prev) => (prev + 1) % totalPages);
  };

  return (
    <section
      id="client-trust"
      aria-label="Client Trust and Verified Importer Reviews"
      className="bg-[#F8F9FA] border-t border-slate-200"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14">
        {/* Header & Credibility Benchmark */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#B91C1C]">
              Client Trust · Verified Global Importers
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight [text-wrap:balance]">
              Trusted by Dealerships &amp; Fleet Buyers Across 48 Ports
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Every review below comes from a verified bill of lading delivery dispatched from Yokohama, Nagoya, Kobe, or Hakata.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 text-amber-500" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-mono text-lg font-bold text-slate-950 tabular-nums">
                  4.9 / 5.0
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                640+ Verified Port Deliveries
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous client reviews"
                className="p-2.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-slate-600 px-1.5 tabular-nums">
                0{pageIndex + 1} / 0{totalPages}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next client reviews"
                className="p-2.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Testimonial Carousel Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5"
            >
              <div>
                {/* Rating & Unboxed Metadata */}
                <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-1 text-amber-500" aria-label={`Rated ${review.rating} out of 5`}>
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    ))}
                    <span className="ml-1 font-mono text-xs font-semibold text-slate-900 tabular-nums">
                      {review.rating}.0
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    {review.date}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1">
                <p className="font-display text-sm font-bold text-slate-950">
                  {review.buyerName}
                </p>
                <p className="text-xs text-slate-600">
                  {review.role}, {review.company}
                </p>
                <p className="font-mono text-[11px] text-slate-500 pt-1">
                  {review.destination} · {review.vehicleBought}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Carousel Page Indicators */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPageIndex(idx)}
              aria-label={`View review group ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === pageIndex
                  ? 'w-7 bg-[#B91C1C]'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

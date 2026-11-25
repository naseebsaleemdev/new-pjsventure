import { PageRoute } from '../types/vehicle';

interface NavbarProps {
  currentRoute: PageRoute;
  inquiryCount: number;
  onNavigate: (route: PageRoute) => void;
  onOpenInquiry: () => void;
}

export function Navbar({
  currentRoute,
  inquiryCount,
  onNavigate,
  onOpenInquiry,
}: NavbarProps) {
  const isRoute = (name: PageRoute['name']) => currentRoute.name === name;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate({ name: 'home' })}
          className="font-display text-xl font-extrabold tracking-tight text-slate-950 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B91C1C]"
        >
          Pjs Venture
        </button>

        {/* Zone 2: 5 concise single-line public navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700"
        >
          <button
            type="button"
            onClick={() => onNavigate({ name: 'used-cars' })}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#B91C1C] ${
              isRoute('used-cars') || isRoute('car') || isRoute('compare')
                ? 'text-[#B91C1C] font-semibold underline underline-offset-4 decoration-[#B91C1C]'
                : 'hover:underline underline-offset-4 decoration-[#B91C1C]/40'
            }`}
          >
            Used Cars
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'auction' })}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#B91C1C] ${
              isRoute('auction')
                ? 'text-[#B91C1C] font-semibold underline underline-offset-4 decoration-[#B91C1C]'
                : 'hover:underline underline-offset-4 decoration-[#B91C1C]/40'
            }`}
          >
            Car Auction
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'how-to-buy' })}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#B91C1C] ${
              isRoute('how-to-buy')
                ? 'text-[#B91C1C] font-semibold underline underline-offset-4 decoration-[#B91C1C]'
                : 'hover:underline underline-offset-4 decoration-[#B91C1C]/40'
            }`}
          >
            How to Buy
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'ports' })}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#B91C1C] ${
              isRoute('ports')
                ? 'text-[#B91C1C] font-semibold underline underline-offset-4 decoration-[#B91C1C]'
                : 'hover:underline underline-offset-4 decoration-[#B91C1C]/40'
            }`}
          >
            Shipping Ports
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'contact' })}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-[#B91C1C] ${
              isRoute('contact')
                ? 'text-[#B91C1C] font-semibold underline underline-offset-4 decoration-[#B91C1C]'
                : 'hover:underline underline-offset-4 decoration-[#B91C1C]/40'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenInquiry}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C1C] tabular-nums"
          >
            {inquiryCount > 0 ? `Inquiry List (${inquiryCount})` : 'Request Quote'}
          </button>
        </div>
      </div>

      {/* Compact Mobile Page Switcher */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs font-medium text-slate-700">
        <button
          type="button"
          onClick={() => onNavigate({ name: 'used-cars' })}
          className={`whitespace-nowrap shrink-0 ${
            isRoute('used-cars') || isRoute('car') || isRoute('compare')
              ? 'text-[#B91C1C] font-semibold'
              : ''
          }`}
        >
          Used Cars
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ name: 'auction' })}
          className={`whitespace-nowrap shrink-0 ${isRoute('auction') ? 'text-[#B91C1C] font-semibold' : ''}`}
        >
          Car Auction
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ name: 'how-to-buy' })}
          className={`whitespace-nowrap shrink-0 ${isRoute('how-to-buy') ? 'text-[#B91C1C] font-semibold' : ''}`}
        >
          How to Buy
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ name: 'ports' })}
          className={`whitespace-nowrap shrink-0 ${isRoute('ports') ? 'text-[#B91C1C] font-semibold' : ''}`}
        >
          Shipping Ports
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ name: 'contact' })}
          className={`whitespace-nowrap shrink-0 ${isRoute('contact') ? 'text-[#B91C1C] font-semibold' : ''}`}
        >
          Contact
        </button>
      </div>
    </header>
  );
}

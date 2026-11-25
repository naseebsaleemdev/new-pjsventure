import { useEffect, useState } from 'react';
import {
  Anchor,
  BookOpen,
  Car,
  ClipboardList,
  FileSearch,
  Gavel,
  Home,
  Menu,
  Newspaper,
  Phone,
  Ship,
  X,
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRoute = (name: PageRoute['name']) => currentRoute.name === name;

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleMobileNavigate = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const primaryLinks: Array<{
    route: PageRoute;
    label: string;
    active: boolean;
    icon: typeof Car;
  }> = [
    {
      route: { name: 'home' },
      label: 'Home',
      active: isRoute('home'),
      icon: Home,
    },
    {
      route: { name: 'used-cars' },
      label: 'Used Cars',
      active: isRoute('used-cars') || isRoute('car') || isRoute('compare'),
      icon: Car,
    },
    {
      route: { name: 'auction' },
      label: 'Car Auction',
      active: isRoute('auction'),
      icon: Gavel,
    },
    {
      route: { name: 'how-to-buy' },
      label: 'How to Buy',
      active: isRoute('how-to-buy'),
      icon: BookOpen,
    },
    {
      route: { name: 'ports' },
      label: 'Shipping Ports',
      active: isRoute('ports'),
      icon: Anchor,
    },
    {
      route: { name: 'contact' },
      label: 'Contact',
      active: isRoute('contact'),
      icon: Phone,
    },
  ];

  const toolLinks: Array<{
    route: PageRoute;
    label: string;
    active: boolean;
    icon: typeof Ship;
  }> = [
    {
      route: { name: 'port-balance' },
      label: 'Port Balance Cars',
      active: isRoute('port-balance'),
      icon: Ship,
    },
    {
      route: { name: 'page', slug: 'chassis-check' },
      label: 'VIN & Chassis Report',
      active:
        currentRoute.name === 'page' && currentRoute.slug === 'chassis-check',
      icon: FileSearch,
    },
    {
      route: { name: 'blog' },
      label: 'Blog & Export Guides',
      active: isRoute('blog') || isRoute('blog-post'),
      icon: Newspaper,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Mobile sidebar trigger + single-line brand wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-sidebar"
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ name: 'home' })}
              className="font-display text-xl font-extrabold tracking-tight text-slate-950 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B91C1C]"
            >
              Pjs Venture
            </button>
          </div>

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
              className="px-3.5 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C1C] tabular-nums"
            >
              {inquiryCount > 0 ? `Inquiry List (${inquiryCount})` : 'Request Quote'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Sidebar Drawer */}
      <div
        id="mobile-nav-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-[1px]"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Left Sidebar Panel */}
        <aside
          className={`relative z-10 w-72 max-w-[85vw] h-[100dvh] bg-white border-r border-slate-200 shadow-2xl flex flex-col transition-transform duration-200 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="px-4 py-4 bg-[#0F172A] text-white flex items-center justify-between shrink-0">
            <div>
              <p className="font-display text-base font-extrabold tracking-tight">
                Pjs Venture
              </p>
              <p className="text-[11px] text-slate-300">
                Direct Japan Export Portal
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Sidebar Links */}
          <nav
            aria-label="Mobile Navigation"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-5"
          >
            <div>
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Main Menu
              </p>
              <div className="space-y-1">
                {primaryLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleMobileNavigate(item.route)}
                      className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm text-left transition-colors cursor-pointer ${
                        item.active
                          ? 'bg-red-50 text-[#B91C1C] font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.active ? 'text-[#B91C1C]' : 'text-slate-500'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Export &amp; Verification
              </p>
              <div className="space-y-1">
                {toolLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleMobileNavigate(item.route)}
                      className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm text-left transition-colors cursor-pointer ${
                        item.active
                          ? 'bg-red-50 text-[#B91C1C] font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.active ? 'text-[#B91C1C]' : 'text-slate-500'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Sidebar Footer Action */}
          <div className="p-3 border-t border-slate-200 bg-[#F8F9FA] shrink-0">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full py-2.5 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors cursor-pointer tabular-nums"
            >
              <ClipboardList className="w-4 h-4" aria-hidden="true" />
              <span>
                {inquiryCount > 0 ? `Inquiry List (${inquiryCount})` : 'Request Quote'}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

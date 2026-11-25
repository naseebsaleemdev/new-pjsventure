/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import {
  GitCompareArrows,
  LayoutGrid,
  List,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { AdminPortalPage } from './components/AdminPortalPage';
import { AuctionOrderSection } from './components/AuctionOrderSection';
import { AuctionPage } from './components/AuctionPage';
import { BlogListPage } from './components/BlogListPage';
import { BlogSinglePage } from './components/BlogSinglePage';
import { ChassisReportPage } from './components/ChassisReportPage';
import { ClientTrustCarousel } from './components/ClientTrustCarousel';
import { ComparePage } from './components/ComparePage';
import { ContactPage } from './components/ContactPage';
import { ExportProcessSection } from './components/ExportProcessSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import {
  GlobalOfficesPage,
  NewsNewsletterPage,
  ReviewsPage,
  SitemapPage,
} from './components/FooterBrandPages';
import { FooterPolicyPage, PolicyPageSlug } from './components/FooterPolicyPage';
import {
  CarTrackingPage,
  ConditionReportPage,
  HelpCenterPage,
} from './components/FooterSupportPages';
import { HeroSlider } from './components/HeroSlider';
import { HowToBuyPage } from './components/HowToBuyPage';
import { InquiryDrawer } from './components/InquiryDrawer';
import { Navbar } from './components/Navbar';
import { PortalSearchHero } from './components/PortalSearchHero';
import {
  PortalSidebar,
  PriceBracket,
  SpecialFilter,
} from './components/PortalSidebar';
import { PortBalancePage } from './components/PortBalancePage';
import { UsedCarsPage } from './components/UsedCarsPage';
import { VehicleCard } from './components/VehicleCard';
import { VehicleRowCard } from './components/VehicleRowCard';
import { VehicleSinglePage } from './components/VehicleSinglePage';
import { INITIAL_BLOG_POSTS } from './data/initialBlogs';
import { INITIAL_CHASSIS_REPORTS } from './data/chassisDecoder';
import { INITIAL_PORTAL_QUERIES } from './data/initialQueries';
import { DESTINATION_PORTS } from './data/ports';
import { VEHICLES } from './data/vehicles';
import {
  BlogPost,
  BodyType,
  ChassisInspectionReport,
  DestinationPort,
  FooterPageSlug,
  PageRoute,
  PortalQuery,
  QueryStatus,
  ShippingMethod,
  SteeringSide,
  Vehicle,
} from './types/vehicle';

type SortOption = 'fob-asc' | 'fob-desc' | 'year-desc' | 'mileage-asc';

const VEHICLES_STORAGE_KEY = 'pjs_venture_vehicles_v2';
const LEGACY_VEHICLES_STORAGE_KEY = 'pjs_venture_vehicles_v1';
const QUERIES_STORAGE_KEY = 'pjs_venture_queries_v1';
const CHASSIS_REPORTS_STORAGE_KEY = 'pjs_venture_chassis_reports_v1';
const BLOG_STORAGE_KEY = 'pjs_venture_blogs_v1';

const FOOTER_PAGE_SLUGS: FooterPageSlug[] = [
  'why-choose-us',
  'reviews',
  'help-center',
  'car-tracking',
  'global-protection',
  'condition-report',
  'chassis-check',
  'about',
  'company-profile',
  'global-offices',
  'csr-policy',
  'news',
  'newsletter',
  'terms',
  'privacy',
  'claims-policy',
  'anti-social-policy',
  'security-export-control',
  'sitemap',
];

function parseLocationRoute(vehicles: Vehicle[]): PageRoute {
  const path = window.location.pathname;
  const hash = window.location.hash.replace(/^#/, '');
  const target = path && path !== '/' ? path : hash;

  if (target === '/used-cars') return { name: 'used-cars' };
  if (target === '/port-balance') return { name: 'port-balance' };
  if (target.startsWith('/car/')) {
    const id = target.slice('/car/'.length);
    if (vehicles.some((v) => v.id === id)) {
      return { name: 'car', vehicleId: id };
    }
  }
  if (target === '/compare') return { name: 'compare' };
  if (target === '/auction') return { name: 'auction' };
  if (target === '/how-to-buy') return { name: 'how-to-buy' };
  if (target === '/ports') return { name: 'ports' };
  if (target === '/contact') return { name: 'contact' };
  if (target === '/blog') return { name: 'blog' };
  if (target.startsWith('/blog/')) {
    const slug = target.slice('/blog/'.length);
    if (slug) return { name: 'blog-post', slug };
  }
  if (target === '/vin-report') return { name: 'page', slug: 'chassis-check' };
  if (target.startsWith('/staff-portal') || target.startsWith('/admin')) {
    if (target.includes('add-car')) return { name: 'admin', tab: 'add-car' };
    if (target.includes('inventory')) return { name: 'admin', tab: 'inventory' };
    if (target.includes('chassis-reports'))
      return { name: 'admin', tab: 'chassis-reports' };
    if (target.includes('blog-posts')) return { name: 'admin', tab: 'blog-posts' };
    if (target.includes('users')) return { name: 'admin', tab: 'users' };
    return { name: 'admin', tab: 'queries' };
  }
  const cleanSlug = target.replace(/^\//, '') as FooterPageSlug;
  if (FOOTER_PAGE_SLUGS.includes(cleanSlug)) {
    return { name: 'page', slug: cleanSlug };
  }
  return { name: 'home' };
}

function routeToPath(route: PageRoute): string {
  switch (route.name) {
    case 'used-cars':
      return '/used-cars';
    case 'port-balance':
      return '/port-balance';
    case 'car':
      return `/car/${route.vehicleId}`;
    case 'compare':
      return '/compare';
    case 'auction':
      return '/auction';
    case 'how-to-buy':
      return '/how-to-buy';
    case 'ports':
      return '/ports';
    case 'contact':
      return '/contact';
    case 'blog':
      return '/blog';
    case 'blog-post':
      return `/blog/${route.slug}`;
    case 'page':
      return `/${route.slug}`;
    case 'admin':
      return route.tab && route.tab !== 'queries'
        ? `/staff-portal/${route.tab}`
        : '/staff-portal';
    default:
      return '/';
  }
}

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(VEHICLES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const legacy = localStorage.getItem(LEGACY_VEHICLES_STORAGE_KEY);
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy)) {
          const seedIds = new Set(VEHICLES.map((v) => v.id));
          const customUnits = parsedLegacy.filter(
            (v): v is Vehicle => Boolean(v && typeof v.id === 'string' && !seedIds.has(v.id))
          );
          return [...customUnits, ...VEHICLES];
        }
      }
    } catch {
      // Fallback to default stock
    }
    return VEHICLES;
  });

  const [queries, setQueries] = useState<PortalQuery[]>(() => {
    try {
      const saved = localStorage.getItem(QUERIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to seeded queries
    }
    return INITIAL_PORTAL_QUERIES;
  });

  const [chassisReports, setChassisReports] = useState<ChassisInspectionReport[]>(() => {
    try {
      const saved = localStorage.getItem(CHASSIS_REPORTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to seeded chassis reports
    }
    return INITIAL_CHASSIS_REPORTS;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(BLOG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to seeded blog posts
    }
    return INITIAL_BLOG_POSTS;
  });

  const [selectedChassisForReport, setSelectedChassisForReport] = useState<string>('');

  const [route, setRoute] = useState<PageRoute>(() => parseLocationRoute(vehicles));

  useEffect(() => {
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogPosts));
    } catch {
      // Ignore storage quota errors
    }
  }, [blogPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(
        CHASSIS_REPORTS_STORAGE_KEY,
        JSON.stringify(chassisReports)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [chassisReports]);

  useEffect(() => {
    try {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
    } catch {
      // Ignore storage quota errors
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(queries));
    } catch {
      // Ignore storage quota errors
    }
  }, [queries]);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(parseLocationRoute(vehicles));
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, [vehicles]);

  const navigate = (nextRoute: PageRoute) => {
    setRoute(nextRoute);
    const nextPath = routeToPath(nextRoute);
    if (window.location.pathname !== nextPath || window.location.hash) {
      window.history.pushState(null, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Catalog Filters State
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [selectedBodyType, setSelectedBodyType] = useState<BodyType>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [selectedSteering, setSelectedSteering] = useState<'All' | SteeringSide>('All');
  const [yearFrom, setYearFrom] = useState<string>('All');
  const [maxFob, setMaxFob] = useState<string>('All');
  const [priceBracket, setPriceBracket] = useState<PriceBracket>('all');
  const [specialFilter, setSpecialFilter] = useState<SpecialFilter>('all');
  const [selectedYard, setSelectedYard] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('fob-asc');
  const [homeViewMode, setHomeViewMode] = useState<'list' | 'grid'>('list');
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);

  // Port & CIF Calculator State
  const [selectedPort, setSelectedPort] = useState<DestinationPort>(DESTINATION_PORTS[0]);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('Ro-Ro Vessel');
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);

  // Multi-Unit Inquiry Cart & Compare Selection
  const [inquiryList, setInquiryList] = useState<Vehicle[]>([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const compareVehicles = useMemo(
    () =>
      compareIds
        .map((id) => vehicles.find((v) => v.id === id))
        .filter((v): v is Vehicle => Boolean(v)),
    [compareIds, vehicles]
  );

  const isPortBalanceVehicle = (v: Vehicle) =>
    v.availability === 'Port Balance' ||
    (v.stockLocation !== undefined && v.stockLocation !== 'Japan Yard');

  const japanYardVehicles = useMemo(
    () => vehicles.filter((v) => !isPortBalanceVehicle(v)),
    [vehicles]
  );

  const portBalanceVehicles = useMemo(
    () => vehicles.filter((v) => isPortBalanceVehicle(v)),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = japanYardVehicles.filter((v) => {
      if (selectedMake !== 'All' && v.make !== selectedMake) return false;
      if (selectedBodyType !== 'All' && v.bodyType !== selectedBodyType) return false;
      if (selectedFuel !== 'All' && v.fuel !== selectedFuel) return false;
      if (selectedSteering !== 'All' && v.steering !== selectedSteering) return false;
      if (selectedYard !== 'All' && v.yardPort !== selectedYard) return false;
      if (yearFrom !== 'All' && v.year < Number(yearFrom)) return false;
      if (maxFob !== 'All' && v.fobUsd > Number(maxFob)) return false;

      if (priceBracket === 'under-10k' && v.fobUsd >= 10000) return false;
      if (priceBracket === '10k-20k' && (v.fobUsd < 10000 || v.fobUsd > 20000)) return false;
      if (priceBracket === '20k-30k' && (v.fobUsd <= 20000 || v.fobUsd > 30000)) return false;
      if (priceBracket === 'over-30k' && v.fobUsd <= 30000) return false;

      if (specialFilter === 'hybrid' && v.fuel !== 'Hybrid') return false;
      if (specialFilter === 'diesel-4wd' && !(v.fuel === 'Diesel' && v.drive !== '2WD'))
        return false;
      if (specialFilter === 'low-mileage' && v.mileageKm >= 35000) return false;
      if (specialFilter === 'lhd' && v.steering !== 'LHD') return false;
      if (specialFilter === 'grade-45' && parseFloat(v.auctionGrade) < 4.5) return false;

      if (query) {
        const haystack =
          `${v.make} ${v.model} ${v.trim} ${v.chassisCode} ${v.stockNo} ${v.yardPort} ${v.bodyType}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      switch (sortBy) {
        case 'fob-asc':
          return a.fobUsd - b.fobUsd;
        case 'fob-desc':
          return b.fobUsd - a.fobUsd;
        case 'year-desc':
          return b.year - a.year || b.month - a.month;
        case 'mileage-asc':
          return a.mileageKm - b.mileageKm;
      }
    });
  }, [
    japanYardVehicles,
    selectedMake,
    selectedBodyType,
    selectedFuel,
    selectedSteering,
    selectedYard,
    yearFrom,
    maxFob,
    priceBracket,
    specialFilter,
    searchQuery,
    sortBy,
  ]);

  const toggleInquiryVehicle = (vehicle: Vehicle) => {
    setInquiryList((prev) => {
      const exists = prev.some((item) => item.id === vehicle.id);
      if (exists) {
        return prev.filter((item) => item.id !== vehicle.id);
      }
      return [...prev, vehicle];
    });
  };

  const toggleCompareVehicle = (vehicle: Vehicle) => {
    setCompareIds((prev) => {
      if (prev.includes(vehicle.id)) {
        return prev.filter((id) => id !== vehicle.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), vehicle.id];
      }
      return [...prev, vehicle.id];
    });
  };

  const handleQuickQuote = (vehicle: Vehicle) => {
    setInquiryList((prev) =>
      prev.some((item) => item.id === vehicle.id) ? prev : [...prev, vehicle]
    );
    setIsInquiryOpen(true);
  };

  const handleOpenVehicleSinglePage = (vehicle: Vehicle) => {
    navigate({ name: 'car', vehicleId: vehicle.id });
  };

  const handleAddPortalQuery = (
    payload: Omit<PortalQuery, 'id' | 'referenceId' | 'status' | 'createdAt'>
  ): PortalQuery => {
    const prefix = payload.type === 'Auction Request' ? 'AUC' : 'PJV';
    const ref = `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const createdAt = `${now.toISOString().slice(0, 10)} ${now
      .toTimeString()
      .slice(0, 5)} JST`;

    const newQuery: PortalQuery = {
      ...payload,
      id: `q-${Date.now()}`,
      referenceId: ref,
      status: 'New',
      createdAt,
    };

    setQueries((prev) => [newQuery, ...prev]);
    return newQuery;
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  const handleUpdateVehicle = (updated: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    setInquiryList((prev) => prev.filter((v) => v.id !== vehicleId));
    setCompareIds((prev) => prev.filter((id) => id !== vehicleId));
  };

  const handleUpdateQueryStatus = (
    queryId: string,
    status: QueryStatus,
    adminNote?: string
  ) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? { ...q, status, adminNote: adminNote !== undefined ? adminNote : q.adminNote }
          : q
      )
    );
  };

  const handleDeleteQuery = (queryId: string) => {
    setQueries((prev) => prev.filter((q) => q.id !== queryId));
  };

  const handleResetFilters = () => {
    setSelectedMake('All');
    setSelectedBodyType('All');
    setSelectedFuel('All');
    setSelectedSteering('All');
    setYearFrom('All');
    setMaxFob('All');
    setPriceBracket('all');
    setSpecialFilter('all');
    setSelectedYard('All');
    setSearchQuery('');
    setSortBy('fob-asc');
  };

  const activeSingleVehicle =
    route.name === 'car'
      ? vehicles.find((v) => v.id === route.vehicleId) ?? vehicles[0]
      : null;

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F1F5F9] text-slate-900">
      <Navbar
        currentRoute={route}
        inquiryCount={inquiryList.length}
        onNavigate={navigate}
        onOpenInquiry={() => setIsInquiryOpen(true)}
      />

      {/* Portal CIF & Destination Utility Bar (Shown on customer storefront pages) */}
      {route.name !== 'admin' && (
        <div className="bg-[#0F172A] text-slate-200 border-b border-slate-800">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-slate-300 tabular-nums">
                Japan Stock: <strong className="text-white">{japanYardVehicles.length} Units</strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">
                |
              </span>
              <button
                type="button"
                onClick={() => navigate({ name: 'port-balance' })}
                className="font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4 decoration-amber-400/50 cursor-pointer tabular-nums"
              >
                Port Balance Cars ({portBalanceVehicles.length} Units) →
              </button>
              <span aria-hidden="true" className="hidden sm:inline text-slate-600">
                |
              </span>
              <button
                type="button"
                onClick={() => navigate({ name: 'ports' })}
                className="hidden sm:inline text-slate-300 hover:text-white underline underline-offset-4 decoration-slate-600 cursor-pointer"
              >
                Global Shipping Ports &amp; Freight Schedule
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="top-port-select" className="text-slate-300 font-medium">
                Destination Port:
              </label>
              <select
                id="top-port-select"
                value={selectedPort.id}
                onChange={(e) => {
                  const found = DESTINATION_PORTS.find((p) => p.id === e.target.value);
                  if (found) setSelectedPort(found);
                }}
                className="px-2.5 py-1 text-xs font-medium bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#B91C1C]"
              >
                {DESTINATION_PORTS.map((port) => (
                  <option key={port.id} value={port.id}>
                    {port.portName}, {port.country} ({port.transitDays})
                  </option>
                ))}
              </select>

              <div className="flex items-center p-0.5 bg-slate-800 border border-slate-700 rounded">
                {(['Ro-Ro Vessel', 'Container (20ft)'] as ShippingMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setShippingMethod(method)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                      shippingMethod === method
                        ? 'bg-[#B91C1C] text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {method === 'Ro-Ro Vessel' ? 'Ro-Ro' : '20ft Container'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Route View */}
      <main className="flex-1">
        {route.name === 'home' && (
          <>
            <HeroSlider
              vehicles={vehicles}
              selectedPort={selectedPort}
              shippingMethod={shippingMethod}
              includeInsurance={includeInsurance}
              onInspectVehicle={handleOpenVehicleSinglePage}
              onRequestAuction={() => navigate({ name: 'auction' })}
            />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
              {/* Mobile Sidebar Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  type="button"
                  onClick={() => setShowMobileSidebar((prev) => !prev)}
                  className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {showMobileSidebar
                      ? 'Hide Directory Filters'
                      : 'Browse by Make, Body Type & Price'}
                  </span>
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Directory Sidebar */}
                <div
                  className={`${
                    showMobileSidebar ? 'block' : 'hidden'
                  } lg:block w-full lg:w-64 shrink-0`}
                >
                  <PortalSidebar
                    vehicles={japanYardVehicles}
                    selectedMake={selectedMake}
                    selectedBodyType={selectedBodyType}
                    priceBracket={priceBracket}
                    specialFilter={specialFilter}
                    selectedYard={selectedYard}
                    onSelectMake={setSelectedMake}
                    onSelectBodyType={setSelectedBodyType}
                    onSelectPriceBracket={setPriceBracket}
                    onSelectSpecialFilter={setSpecialFilter}
                    onSelectYard={setSelectedYard}
                    onResetAll={handleResetFilters}
                  />
                </div>

                {/* Right Main Portal Workspace */}
                <div className="flex-1 min-w-0 space-y-8 w-full">
                  <PortalSearchHero
                    vehicles={japanYardVehicles}
                    filteredCount={filteredVehicles.length}
                    selectedMake={selectedMake}
                    selectedBodyType={selectedBodyType}
                    selectedFuel={selectedFuel}
                    selectedSteering={selectedSteering}
                    yearFrom={yearFrom}
                    maxFob={maxFob}
                    selectedYard={selectedYard}
                    portBalanceCount={portBalanceVehicles.length}
                    searchQuery={searchQuery}
                    onChangeMake={setSelectedMake}
                    onChangeBodyType={setSelectedBodyType}
                    onChangeFuel={setSelectedFuel}
                    onChangeSteering={setSelectedSteering}
                    onChangeYearFrom={setYearFrom}
                    onChangeMaxFob={setMaxFob}
                    onChangeYard={setSelectedYard}
                    onOpenPortBalance={() => navigate({ name: 'port-balance' })}
                    onChangeSearchQuery={setSearchQuery}
                    onResetFilters={handleResetFilters}
                  />

                  {/* Stock Results Header & 3-Column Export Grid */}
                  <section id="stock-list" className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="font-display text-lg font-bold text-slate-950">
                          Japan Export Stock List
                        </h2>
                        <p className="text-xs text-slate-500 font-mono tabular-nums">
                          Showing {filteredVehicles.length} of {japanYardVehicles.length} Japan Yard units · Live CIF calculated for {selectedPort.portName} ({shippingMethod})
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {compareVehicles.length > 0 && (
                          <button
                            type="button"
                            onClick={() => navigate({ name: 'compare' })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer tabular-nums"
                          >
                            <GitCompareArrows className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Compare ({compareVehicles.length})</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1 p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setHomeViewMode('list')}
                            aria-label="List view"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                              homeViewMode === 'list'
                                ? 'bg-white text-slate-950 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <List className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>List</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setHomeViewMode('grid')}
                            aria-label="Grid view"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                              homeViewMode === 'grid'
                                ? 'bg-white text-slate-950 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Grid</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="sort-select"
                            className="text-xs font-medium text-slate-600 whitespace-nowrap"
                          >
                            Sort by:
                          </label>
                          <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="px-3 py-1.5 text-xs font-medium bg-[#F8F9FA] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#B91C1C]"
                          >
                            <option value="fob-asc">FOB Price: Low to High</option>
                            <option value="fob-desc">FOB Price: High to Low</option>
                            <option value="year-desc">Year: Newest First</option>
                            <option value="mileage-asc">Mileage: Lowest First</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate({ name: 'used-cars' })}
                          className="text-xs font-semibold text-[#B91C1C] hover:underline whitespace-nowrap cursor-pointer"
                        >
                          Full Inventory →
                        </button>
                      </div>
                    </div>

                    {filteredVehicles.length > 0 ? (
                      homeViewMode === 'list' ? (
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
                              onInspect={handleOpenVehicleSinglePage}
                              onToggleInquiry={toggleInquiryVehicle}
                              onToggleCompare={toggleCompareVehicle}
                              onQuickQuote={handleQuickQuote}
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
                              onInspect={handleOpenVehicleSinglePage}
                              onToggleInquiry={toggleInquiryVehicle}
                              onToggleCompare={toggleCompareVehicle}
                              onQuickQuote={handleQuickQuote}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                        <p className="font-display text-lg font-bold text-slate-900">
                          No matching vehicles in current yard stock
                        </p>
                        <p className="mt-1.5 text-sm text-slate-600">
                          Reset filters or submit an auction sourcing request below to bid on your desired specification.
                        </p>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Reset All Filters</span>
                        </button>
                      </div>
                    )}
                  </section>

                  {/* Separate Port Balance Inventory Showcase */}
                  {portBalanceVehicles.length > 0 && (
                    <section className="space-y-4 pt-2">
                      <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h2 className="font-display text-lg font-bold text-slate-950">
                            Port Balance Cars (Arrived &amp; In Transit)
                          </h2>
                          <p className="text-xs text-slate-500">
                            Dedicated destination port units — reserve with Booking Deposit and settle remaining Port Balance on arrival.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate({ name: 'port-balance' })}
                          className="text-xs font-semibold text-[#B91C1C] hover:underline whitespace-nowrap cursor-pointer"
                        >
                          View All Port Balance Cars ({portBalanceVehicles.length}) →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {portBalanceVehicles.slice(0, 3).map((vehicle) => (
                          <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            selectedPort={selectedPort}
                            shippingMethod={shippingMethod}
                            includeInsurance={includeInsurance}
                            isInInquiry={inquiryList.some((item) => item.id === vehicle.id)}
                            isInCompare={compareIds.includes(vehicle.id)}
                            onInspect={handleOpenVehicleSinglePage}
                            onToggleInquiry={toggleInquiryVehicle}
                            onToggleCompare={toggleCompareVehicle}
                            onQuickQuote={handleQuickQuote}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  <AuctionOrderSection
                    selectedPort={selectedPort}
                    onSubmitAuctionQuery={handleAddPortalQuery}
                  />
                </div>
              </div>
            </div>

            <ExportProcessSection
              selectedPort={selectedPort}
              onSelectPort={setSelectedPort}
            />

            <ClientTrustCarousel />
          </>
        )}

        {route.name === 'used-cars' && (
          <UsedCarsPage
            vehicles={japanYardVehicles}
            filteredVehicles={filteredVehicles}
            selectedMake={selectedMake}
            selectedBodyType={selectedBodyType}
            selectedFuel={selectedFuel}
            selectedSteering={selectedSteering}
            yearFrom={yearFrom}
            maxFob={maxFob}
            priceBracket={priceBracket}
            specialFilter={specialFilter}
            portBalanceCount={portBalanceVehicles.length}
            selectedYard={selectedYard}
            searchQuery={searchQuery}
            sortBy={sortBy}
            selectedPort={selectedPort}
            shippingMethod={shippingMethod}
            includeInsurance={includeInsurance}
            inquiryList={inquiryList}
            compareIds={compareIds}
            onChangeMake={setSelectedMake}
            onChangeBodyType={setSelectedBodyType}
            onChangeFuel={setSelectedFuel}
            onChangeSteering={setSelectedSteering}
            onChangeYearFrom={setYearFrom}
            onChangeMaxFob={setMaxFob}
            onChangePriceBracket={setPriceBracket}
            onChangeSpecialFilter={setSpecialFilter}
            onChangeYard={setSelectedYard}
            onChangeSearchQuery={setSearchQuery}
            onChangeSortBy={setSortBy}
            onResetFilters={handleResetFilters}
            onInspectVehicle={handleOpenVehicleSinglePage}
            onToggleInquiry={toggleInquiryVehicle}
            onToggleCompare={toggleCompareVehicle}
            onQuickQuote={handleQuickQuote}
            onNavigate={navigate}
          />
        )}

        {route.name === 'port-balance' && (
          <PortBalancePage
            portBalanceVehicles={portBalanceVehicles}
            selectedPort={selectedPort}
            shippingMethod={shippingMethod}
            includeInsurance={includeInsurance}
            inquiryList={inquiryList}
            compareIds={compareIds}
            onInspectVehicle={handleOpenVehicleSinglePage}
            onToggleInquiry={toggleInquiryVehicle}
            onToggleCompare={toggleCompareVehicle}
            onQuickQuote={handleQuickQuote}
            onNavigate={navigate}
          />
        )}

        {route.name === 'car' && activeSingleVehicle && (
          <VehicleSinglePage
            vehicle={activeSingleVehicle}
            allVehicles={vehicles}
            selectedPort={selectedPort}
            shippingMethod={shippingMethod}
            includeInsurance={includeInsurance}
            isInInquiry={inquiryList.some((item) => item.id === activeSingleVehicle.id)}
            isInCompare={compareIds.includes(activeSingleVehicle.id)}
            onChangePort={setSelectedPort}
            onChangeShippingMethod={setShippingMethod}
            onChangeInsurance={setIncludeInsurance}
            onToggleInquiry={toggleInquiryVehicle}
            onToggleCompare={toggleCompareVehicle}
            onSubmitDirectQuery={handleAddPortalQuery}
            onSelectVehicle={handleOpenVehicleSinglePage}
            onInspectChassis={(chassisCode) => {
              setSelectedChassisForReport(chassisCode);
              navigate({ name: 'page', slug: 'chassis-check' });
            }}
            onFilterMake={(make) => {
              handleResetFilters();
              setSelectedMake(make);
              navigate({ name: 'used-cars' });
            }}
            onGoHome={() => navigate({ name: 'home' })}
            onBackToStock={() => navigate({ name: 'used-cars' })}
          />
        )}

        {route.name === 'compare' && (
          <ComparePage
            vehicles={compareVehicles}
            selectedPort={selectedPort}
            shippingMethod={shippingMethod}
            includeInsurance={includeInsurance}
            inquiryIds={inquiryList.map((v) => v.id)}
            onRemoveVehicle={(id) =>
              setCompareIds((prev) => prev.filter((item) => item !== id))
            }
            onClearAll={() => setCompareIds([])}
            onInspectVehicle={handleOpenVehicleSinglePage}
            onToggleInquiry={toggleInquiryVehicle}
            onBackToStock={() => navigate({ name: 'home' })}
          />
        )}

        {route.name === 'auction' && (
          <AuctionPage
            selectedPort={selectedPort}
            onSubmitAuctionQuery={handleAddPortalQuery}
          />
        )}

        {route.name === 'page' && (
          <>
            {route.slug === 'car-tracking' && (
              <CarTrackingPage onNavigate={navigate} />
            )}
            {route.slug === 'chassis-check' && (
              <ChassisReportPage
                initialChassis={selectedChassisForReport}
                vehicles={vehicles}
                customReports={chassisReports}
                onAddChassisReport={(rep) =>
                  setChassisReports((prev) => [rep, ...prev])
                }
                onNavigate={navigate}
                onInspectVehicle={handleOpenVehicleSinglePage}
              />
            )}
            {route.slug === 'help-center' && (
              <HelpCenterPage onNavigate={navigate} />
            )}
            {route.slug === 'condition-report' && (
              <ConditionReportPage onNavigate={navigate} />
            )}
            {route.slug === 'reviews' && <ReviewsPage onNavigate={navigate} />}
            {route.slug === 'global-offices' && (
              <GlobalOfficesPage onNavigate={navigate} />
            )}
            {(route.slug === 'news' || route.slug === 'newsletter') && (
              <NewsNewsletterPage
                mode={route.slug}
                onNavigate={navigate}
                onSubmitQuery={handleAddPortalQuery}
              />
            )}
            {route.slug === 'sitemap' && <SitemapPage onNavigate={navigate} />}
            {[
              'why-choose-us',
              'global-protection',
              'about',
              'company-profile',
              'csr-policy',
              'terms',
              'privacy',
              'claims-policy',
              'anti-social-policy',
              'security-export-control',
            ].includes(route.slug) && (
              <FooterPolicyPage
                slug={route.slug as PolicyPageSlug}
                onNavigate={navigate}
              />
            )}
          </>
        )}

        {(route.name === 'how-to-buy' || route.name === 'ports') && (
          <HowToBuyPage
            selectedPort={selectedPort}
            onSelectPort={setSelectedPort}
            onBackToStock={() => navigate({ name: 'home' })}
          />
        )}

        {route.name === 'contact' && (
          <ContactPage
            selectedPort={selectedPort}
            onSubmitContactQuery={handleAddPortalQuery}
          />
        )}

        {route.name === 'blog' && (
          <BlogListPage
            posts={blogPosts}
            onOpenPost={(post) => navigate({ name: 'blog-post', slug: post.slug })}
            onNavigate={navigate}
          />
        )}

        {route.name === 'blog-post' && (
          <BlogSinglePage
            post={
              blogPosts.find((p) => p.slug === route.slug) ||
              blogPosts.find((p) => p.status === 'Published') ||
              blogPosts[0]
            }
            allPosts={blogPosts}
            onOpenPost={(post) => navigate({ name: 'blog-post', slug: post.slug })}
            onNavigate={navigate}
          />
        )}

        {route.name === 'admin' && (
          <AdminPortalPage
            initialTab={route.tab}
            vehicles={vehicles}
            queries={queries}
            chassisReports={chassisReports}
            blogPosts={blogPosts}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onUpdateQueryStatus={handleUpdateQueryStatus}
            onDeleteQuery={handleDeleteQuery}
            onAddChassisReport={(rep) =>
              setChassisReports((prev) => [rep, ...prev])
            }
            onDeleteChassisReport={(id) =>
              setChassisReports((prev) => prev.filter((r) => r.id !== id))
            }
            onViewChassisReport={(chassisNo) => {
              setSelectedChassisForReport(chassisNo);
              navigate({ name: 'page', slug: 'chassis-check' });
            }}
            onAddBlogPost={(post) => setBlogPosts((prev) => [post, ...prev])}
            onUpdateBlogPost={(updated) =>
              setBlogPosts((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              )
            }
            onDeleteBlogPost={(id) =>
              setBlogPosts((prev) => prev.filter((p) => p.id !== id))
            }
            onViewBlogPost={(post) =>
              navigate({ name: 'blog-post', slug: post.slug })
            }
            onViewVehiclePage={handleOpenVehicleSinglePage}
            onBackToStorefront={() => navigate({ name: 'home' })}
          />
        )}
      </main>

      {/* Compact Sticky Compare Bar (appears only when >= 1 vehicle selected outside Compare & Admin views) */}
      {compareVehicles.length > 0 &&
        route.name !== 'compare' &&
        route.name !== 'admin' && (
          <div className="sticky bottom-0 z-30 bg-[#0F172A] text-white border-t border-slate-700 shadow-lg">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 overflow-x-auto">
                <span className="font-mono text-xs font-semibold text-slate-300 shrink-0 tabular-nums">
                  Compare ({compareVehicles.length}/4):
                </span>
                <div className="flex items-center gap-2">
                  {compareVehicles.map((v) => (
                    <span
                      key={v.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-xs whitespace-nowrap"
                    >
                      <span>
                        {v.year} {v.make} {v.model}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${v.make} ${v.model} from compare`}
                        onClick={() => toggleCompareVehicle(v)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCompareIds([])}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ name: 'compare' })}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <GitCompareArrows className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Compare Side-by-Side</span>
                </button>
              </div>
            </div>
          </div>
        )}

      <Footer onNavigate={navigate} />

      {route.name !== 'admin' && (
        <FloatingWhatsApp
          vehicles={vehicles}
          activeVehicle={activeSingleVehicle}
          selectedPort={selectedPort}
          hasBottomCompareBar={
            compareVehicles.length > 0 && route.name !== 'compare'
          }
          onSubmitWhatsAppQuery={handleAddPortalQuery}
        />
      )}

      <InquiryDrawer
        isOpen={isInquiryOpen}
        vehicles={inquiryList}
        selectedPort={selectedPort}
        shippingMethod={shippingMethod}
        includeInsurance={includeInsurance}
        onChangePort={setSelectedPort}
        onChangeShippingMethod={setShippingMethod}
        onRemoveVehicle={(id) =>
          setInquiryList((prev) => prev.filter((item) => item.id !== id))
        }
        onClearVehicles={() => setInquiryList([])}
        onSubmitProformaQuery={handleAddPortalQuery}
        onClose={() => setIsInquiryOpen(false)}
      />
    </div>
  );
}

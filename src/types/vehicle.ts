export type BodyType =
  | 'All'
  | 'SUV'
  | 'Sedan'
  | 'Hatchback'
  | 'Van / Mini Van'
  | 'Pickup'
  | 'Truck';

export type SteeringSide = 'RHD' | 'LHD';

export type ShippingMethod = 'Ro-Ro Vessel' | 'Container (20ft)';

export type FooterPageSlug =
  | 'why-choose-us'
  | 'reviews'
  | 'help-center'
  | 'car-tracking'
  | 'global-protection'
  | 'condition-report'
  | 'chassis-check'
  | 'about'
  | 'company-profile'
  | 'global-offices'
  | 'csr-policy'
  | 'news'
  | 'newsletter'
  | 'terms'
  | 'privacy'
  | 'claims-policy'
  | 'anti-social-policy'
  | 'security-export-control'
  | 'sitemap';

export type PageRoute =
  | { name: 'home' }
  | { name: 'used-cars' }
  | { name: 'port-balance' }
  | { name: 'car'; vehicleId: string }
  | { name: 'compare' }
  | { name: 'auction' }
  | { name: 'how-to-buy' }
  | { name: 'ports' }
  | { name: 'contact' }
  | { name: 'blog' }
  | { name: 'blog-post'; slug: string }
  | { name: 'page'; slug: FooterPageSlug }
  | {
      name: 'admin';
      tab?:
        | 'queries'
        | 'add-car'
        | 'inventory'
        | 'chassis-reports'
        | 'blog-posts'
        | 'users';
    };

export type StaffRole = 'Super Admin' | 'Export Coordinator' | 'Blog Editor';

export interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  portDesk: string;
  active: boolean;
  createdAt: string;
}

export type BlogCategory =
  | 'Buying Guides'
  | 'Shipping & Ports'
  | 'Auction Tips'
  | 'Port Balance'
  | 'VIN & Inspection';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: string;
  coverImage: string;
  tags: string[];
  status: 'Published' | 'Draft';
  publishedAt: string;
  readMinutes: number;
}

export interface ChassisInspectionReport {
  id: string;
  reportNo: string;
  chassisNo: string;
  make: string;
  model: string;
  year: number;
  month: number;
  engineCc: number;
  fuel: 'Petrol' | 'Diesel' | 'Hybrid';
  transmission: 'Automatic' | 'CVT' | 'Manual';
  drive: '4WD' | '2WD' | 'AWD';
  color: string;
  mileageKm: number;
  inspectionAgency: 'JEVIC' | 'JAAI' | 'QISJ';
  inspectionYard: string;
  inspectionDate: string;
  auctionGrade: string;
  exteriorGrade: string;
  interiorGrade: string;
  radiationLevel: string;
  odometerStatus: 'Verified Genuine' | 'Cluster Replaced (Disclosed)';
  accidentHistory: 'No Structural Frame Damage' | 'Minor Bolt-On Panel Repaired (R)';
  floodStatus: string;
  theftRecord?: string;
  salvageRecord?: string;
  recallStatus?: string;
  registrationHistory?: {
    period: string;
    region: string;
    usage: string;
    event: string;
  }[];
  panelCodes: {
    front: string;
    hood: string;
    roof: string;
    leftSide: string;
    rightSide: string;
    rear: string;
  };
  mechanicalChecks: {
    engine: string;
    transmission: string;
    suspension: string;
    brakesAbs: string;
    acCooling: string;
    underbodyRust: string;
  };
  mileageHistory: {
    date: string;
    mileageKm: number;
    source: string;
  }[];
  inspectorNote: string;
  linkedVehicleId?: string;
}

export type StockLocationType = 'Japan Yard' | 'Port Balance (At Port)' | 'Port Balance (In Transit)';

export interface Vehicle {
  id: string;
  stockNo: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  month: number;
  bodyType: Exclude<BodyType, 'All'>;
  chassisCode: string;
  engineCc: number;
  fuel: 'Petrol' | 'Diesel' | 'Hybrid';
  transmission: 'Automatic' | 'CVT' | 'Manual';
  drive: '4WD' | '2WD' | 'AWD';
  steering: SteeringSide;
  mileageKm: number;
  color: string;
  seats: number;
  doors: number;
  auctionGrade: string;
  interiorGrade: string;
  exteriorGrade: string;
  yardPort: 'Yokohama' | 'Nagoya' | 'Kobe' | 'Hakata' | 'Osaka';
  stockLocation?: StockLocationType;
  portBalancePort?: string;
  depositUsd?: number;
  portBalanceUsd?: number;
  fobUsd: number;
  m3Volume: number;
  imageUrl: string;
  galleryImages?: string[];
  inspectionAgency: 'JEVIC' | 'JAAI' | 'QISJ';
  features: string[];
  inspectorNote: string;
  availability: 'Ready to Ship' | 'New Arrival' | 'Port Balance';
}

export interface DestinationPort {
  id: string;
  country: string;
  portName: string;
  region:
    | 'East Africa'
    | 'Southern Africa'
    | 'Caribbean'
    | 'South Asia'
    | 'UK & Europe'
    | 'Oceania'
    | 'Middle East';
  roroRatePerM3: number;
  containerFlatUsd: number;
  transitDays: string;
  mandatoryInspection: string;
  insuranceRatePct: number;
}

export type QueryType =
  | 'Vehicle Inquiry'
  | 'Proforma Cart'
  | 'Auction Request'
  | 'General Contact';

export type QueryStatus = 'New' | 'Proforma Sent' | 'Completed';

export interface PortalQuery {
  id: string;
  referenceId: string;
  type: QueryType;
  status: QueryStatus;
  buyerName: string;
  companyName: string;
  email: string;
  phoneWhatsApp: string;
  destinationPort: string;
  shippingMethod?: ShippingMethod;
  subject: string;
  vehicleRefs: string[];
  estimatedCifUsd?: number;
  notes: string;
  adminNote?: string;
  createdAt: string;
}

export interface InquirySubmission {
  referenceId: string;
  buyerName: string;
  companyName: string;
  email: string;
  phoneWhatsApp: string;
  port: DestinationPort;
  shippingMethod: ShippingMethod;
  includeInsurance: boolean;
  vehicles: Vehicle[];
  totalFobUsd: number;
  totalFreightUsd: number;
  totalInsuranceUsd: number;
  totalCifUsd: number;
  notes: string;
  submittedAt: string;
}

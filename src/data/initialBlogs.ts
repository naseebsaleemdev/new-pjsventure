import { BlogPost } from '../types/vehicle';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-vin-report-guide',
    slug: 'how-to-read-japanese-vin-and-chassis-inspection-reports',
    title: 'How to Read a Japanese VIN & Chassis Inspection Report Before Importing',
    excerpt:
      'Learn how Pjs Venture verifies Shaken odometer logs, JEVIC radiation checks, and USS auction sheet defect codes before your vehicle leaves Yokohama.',
    category: 'VIN & Inspection',
    author: 'Kenji Takahashi · Senior Yard Inspector',
    coverImage: '/src/assets/images/hero_yokohama_port_1795543166709.jpg',
    tags: ['VIN Report', 'JEVIC', 'Auction Sheet', 'Odometer Check'],
    status: 'Published',
    publishedAt: '2026-11-21',
    readMinutes: 5,
    content: `## Why Every Importer Needs a Verified VIN & Chassis Report
Unlike North American 17-digit VINs, Japanese domestic market (JDM) vehicles use a compact chassis frame code such as GDJ150W-019482 or AXUH80-003812. Checking this exact frame number protects you against odometer rollbacks, undisclosed flood damage, and age-limit rejection at destination customs.

## What Our VIN & Chassis Report Audits
- Official Japan MLIT Shaken inspection odometer checkpoints recorded every two years
- USS, TAA, and HAA auction grade sheets with panel-by-panel defect symbols (A1, U1, W2, XX)
- JEVIC / JAAI radiation screening (must verify below 0.30 μSv/h prior to Ro-Ro loading)
- Structural frame and flood-line verification across trunk wells and seat rails

> Always match the chassis stamp inside the engine firewall with both the Japanese Export Certificate (Yushutsu Massho) and your Proforma Invoice before sending final settlement.

## Instant Self-Service Lookup
On Pjs Venture, buyers can enter any chassis or VIN directly on our VIN & Chassis Report portal to pull mileage logs, mechanical inspection notes, and registration prefecture history within seconds.`,
  },
  {
    id: 'blog-port-balance-explained',
    slug: 'port-balance-cars-how-destination-settlement-works',
    title: 'Port Balance Cars Explained: Reserve with Deposit & Settle at Destination Port',
    excerpt:
      'Discover how our Port Balance shipping program lets dealers and private buyers book incoming vessels at Mombasa, Dar es Salaam, Karachi, and Jebel Ali.',
    category: 'Port Balance',
    author: 'Haruka Sato · Export Operations Desk',
    coverImage: '/src/assets/images/car_hiace_commuter_1795543168720.jpg',
    tags: ['Port Balance', 'Mombasa', 'Dar es Salaam', 'Karachi', 'Shipping'],
    status: 'Published',
    publishedAt: '2026-11-18',
    readMinutes: 4,
    content: `## What Are Port Balance Vehicles?
Port Balance units are inspected Japanese vehicles that have already departed Yokohama, Nagoya, or Hakata or are pre-positioned at destination discharge terminals. Instead of waiting 30 days for ocean transit, buyers cut lead times dramatically.

## How Payment Works Step-by-Step
- Select any vehicle tagged Port Balance on Pjs Venture and confirm the arrival port
- Pay the initial Booking Deposit via TT wire to lock the chassis exclusively under your consignee name
- Inspect arrival confirmation and settle the remaining Port Balance at destination prior to Bill of Lading endorsement

## Ideal Stock for Fast Dealership Turnover
Commercial vans like the Toyota Hiace 2.8D, fuel-saving hybrids like the Toyota Prius and Vitz, and SUVs like the Mitsubishi Pajero Sport are continuously rotated on our Port Balance vessels.`,
  },
  {
    id: 'blog-roro-vs-container',
    slug: 'roro-vessel-vs-20ft-container-which-shipping-saves-more',
    title: 'Ro-Ro Vessel vs. 20ft Container: Which Japanese Export Method Saves More?',
    excerpt:
      'Comparing freight rates, transit schedules, spare-parts loading rules, and marine insurance across East Africa, Caribbean, and Middle East lanes.',
    category: 'Shipping & Ports',
    author: 'Tariq Mahmood · Logistics Coordinator',
    coverImage: '/src/assets/images/car_land_cruiser_prado_1795543166418.jpg',
    tags: ['Ro-Ro', 'Container Shipping', 'CIF Calculator', 'Logistics'],
    status: 'Published',
    publishedAt: '2026-11-12',
    readMinutes: 6,
    content: `## Choosing Between Ro-Ro and Container Freight
For single SUVs, sedans, and commercial trucks, Roll-on/Roll-off (Ro-Ro) carriers offer the lowest landed CIF cost because ocean freight is billed strictly by cubic meter volume (m³).

## When 20ft or 40ft Container Stuffing Wins
- Shipping two compact hatchbacks or Kei units together inside one shared container
- Importing high-value Grade 5.0 executive MPVs like the Toyota Alphard requiring enclosed weather protection
- Including loose spare tires or dealership accessories packed securely alongside the vehicle

> You can toggle live between Ro-Ro Vessel and Container (20ft) inside any Pjs Venture vehicle page to compare exact CIF totals for your destination port.`,
  },
  {
    id: 'blog-uss-auction-bidding',
    slug: 'bidding-at-uss-tokyo-auction-grade-45-checklist',
    title: 'Bidding at USS Tokyo & HAA Kobe: How to Target Clean Grade 4.5+ Inventory',
    excerpt:
      'How Pjs Venture translates live Japanese auction sheets and avoids hidden repair grades when sourcing vehicles to order.',
    category: 'Auction Tips',
    author: 'Kenji Takahashi · Senior Yard Inspector',
    coverImage: '/src/assets/images/car_harrier_hybrid_1795543168079.jpg',
    tags: ['USS Tokyo', 'Auction Grade', 'Harrier Hybrid', 'Car Auction'],
    status: 'Published',
    publishedAt: '2026-11-05',
    readMinutes: 5,
    content: `## Accessing 120+ Live Weekly Auctions Across Japan
More than 140,000 vehicles cross Japanese auction lanes every week. With Pjs Venture Auction Access, dealerships specify their target model, year bracket, mileage cap, and maximum FOB bid in USD.

## Three Numbers to Check on Every Sheet
- Overall Auction Grade: Target 4.0, 4.5, or 5.0 for clean retail showrooms
- Interior Grade: Look for A or B ratings without smoke or tear remarks
- Inspector Notes: Our bilingual staff translate all handwritten notes on hybrid batteries, underbody rust, and service history before bidding`,
  },
];

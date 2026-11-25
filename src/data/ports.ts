import { DestinationPort, ShippingMethod, Vehicle } from '../types/vehicle';

export const DESTINATION_PORTS: DestinationPort[] = [
  {
    id: 'mombasa',
    country: 'Kenya',
    portName: 'Mombasa',
    region: 'East Africa',
    roroRatePerM3: 118,
    containerFlatUsd: 2650,
    transitDays: '22–26 days',
    mandatoryInspection: 'QISJ / KEBS Roadworthiness',
    insuranceRatePct: 0.015,
  },
  {
    id: 'dar-es-salaam',
    country: 'Tanzania',
    portName: 'Dar es Salaam',
    region: 'East Africa',
    roroRatePerM3: 122,
    containerFlatUsd: 2750,
    transitDays: '24–28 days',
    mandatoryInspection: 'TBS Pre-Shipment Verification',
    insuranceRatePct: 0.015,
  },
  {
    id: 'durban',
    country: 'South Africa',
    portName: 'Durban',
    region: 'Southern Africa',
    roroRatePerM3: 115,
    containerFlatUsd: 2550,
    transitDays: '21–25 days',
    mandatoryInspection: 'SABS / NRCS LOA',
    insuranceRatePct: 0.014,
  },
  {
    id: 'kingston',
    country: 'Jamaica',
    portName: 'Kingston',
    region: 'Caribbean',
    roroRatePerM3: 145,
    containerFlatUsd: 3200,
    transitDays: '28–34 days',
    mandatoryInspection: 'JEVIC Pre-Export Inspection',
    insuranceRatePct: 0.016,
  },
  {
    id: 'port-of-spain',
    country: 'Trinidad & Tobago',
    portName: 'Port of Spain',
    region: 'Caribbean',
    roroRatePerM3: 148,
    containerFlatUsd: 3350,
    transitDays: '30–36 days',
    mandatoryInspection: 'JEVIC Odometer & Safety',
    insuranceRatePct: 0.016,
  },
  {
    id: 'southampton',
    country: 'United Kingdom',
    portName: 'Southampton',
    region: 'UK & Europe',
    roroRatePerM3: 132,
    containerFlatUsd: 2950,
    transitDays: '32–38 days',
    mandatoryInspection: 'JAAI Export Certificate',
    insuranceRatePct: 0.012,
  },
  {
    id: 'colombo',
    country: 'Sri Lanka',
    portName: 'Colombo',
    region: 'South Asia',
    roroRatePerM3: 98,
    containerFlatUsd: 2150,
    transitDays: '14–18 days',
    mandatoryInspection: 'JEVIC / Bureau Veritas',
    insuranceRatePct: 0.013,
  },
  {
    id: 'karachi',
    country: 'Pakistan',
    portName: 'Port Qasim (Karachi)',
    region: 'South Asia',
    roroRatePerM3: 108,
    containerFlatUsd: 2350,
    transitDays: '18–22 days',
    mandatoryInspection: 'JEVIC / JAAI Grade Sheet',
    insuranceRatePct: 0.014,
  },
  {
    id: 'suva',
    country: 'Fiji',
    portName: 'Suva',
    region: 'Oceania',
    roroRatePerM3: 126,
    containerFlatUsd: 2800,
    transitDays: '16–20 days',
    mandatoryInspection: 'Biosecurity & JEVIC',
    insuranceRatePct: 0.015,
  },
  {
    id: 'jebel-ali',
    country: 'UAE',
    portName: 'Jebel Ali (Dubai)',
    region: 'Middle East',
    roroRatePerM3: 105,
    containerFlatUsd: 2250,
    transitDays: '17–21 days',
    mandatoryInspection: 'JAAI Export Deregistration',
    insuranceRatePct: 0.012,
  },
];

export function calculateVehicleCif(
  vehicle: Vehicle,
  port: DestinationPort,
  shippingMethod: ShippingMethod = 'Ro-Ro Vessel',
  includeInsurance: boolean = true
) {
  const freightUsd =
    shippingMethod === 'Ro-Ro Vessel'
      ? Math.round(vehicle.m3Volume * port.roroRatePerM3)
      : port.containerFlatUsd;
  const inspectionFeeUsd = 180;
  const insuranceUsd = includeInsurance
    ? Math.max(120, Math.round((vehicle.fobUsd + freightUsd) * port.insuranceRatePct))
    : 0;
  const totalCifUsd = vehicle.fobUsd + freightUsd + inspectionFeeUsd + insuranceUsd;

  return {
    fobUsd: vehicle.fobUsd,
    freightUsd,
    inspectionFeeUsd,
    insuranceUsd,
    totalCifUsd,
  };
}

// shared/schema.ts

export const CROP_TYPES = [
  "Cereals & Grains",
  "Pulses & Legumes",
  "Oilseeds",
  "Vegetables & Greens",
  "Fruits & Orchards",
  "Fiber Crops",
  "Cash & Sugarcane"
] as const;

export const SOIL_TYPES = [
  "Alluvial Soil",
  "Black Cotton Soil",
  "Red & Yellow Soil",
  "Laterite Soil",
  "Sandy Loam",
  "Clay Loam",
  "Saline / Alkaline"
] as const;

export const IRRIGATION_TYPES = [
  "Drip Irrigation (High Efficiency)",
  "Sprinkler System",
  "Flood / Furrow Irrigation",
  "Rainfed / Monsoonal Only",
  "Canal / Siphon System"
] as const;

export const CLIMATE_CLASSIFICATIONS = [
  "Arid",
  "Semi-Arid",
  "Tropical Wet",
  "Tropical Wet-and-Dry",
  "Humid Subtropical",
  "Temperate",
  "Mediterranean"
] as const;

export const SEASONS = [
  "Kharif / Monsoon",
  "Rabi / Winter",
  "Zaid / Summer",
  "Perennial"
] as const;

export interface User {
  id: string;
  email: string;
  fullName: string;
  farmName?: string;
  region: string;
  createdAt: string;
  updatedAt: string;
}

export interface Field {
  id: string;
  userId: string;
  name: string;
  acreage: number;
  soilType: string;
  irrigationType: string;
  latitude?: number;
  longitude?: number;
  historicalNotes?: string;
  createdAt: string;
}

export interface LifecyclePhase {
  phaseName: string;
  dayRange: string;
  irrigationSchedule: string;
  fertilizationAction: string;
  pestSurveillance: string;
}

export interface EconomicOutlook {
  estimatedCostPerAcre: number;
  estimatedRevenuePerAcre: number;
  recommendedMarketWindow: string;
}

export interface AdvisoryActionPlan {
  cropName: string;
  variety: string;
  confidenceScore: number;
  projectedYieldQuintals: number;
  summary: string;
  soilAmendments: string[];
  lifecyclePhases: LifecyclePhase[];
  economicOutlook: EconomicOutlook;
  agronomicRationale?: string;
}

export interface CropAdvisory {
  id: string;
  userId: string;
  fieldId?: string | null;
  cropName: string;
  variety?: string | null;
  confidenceScore: number;
  soilNitrogenPpm?: number | null;
  soilPhosphorusPpm?: number | null;
  soilPotassiumPpm?: number | null;
  soilPh?: number | null;
  projectedYieldQuintalsPerAcre?: number | null;
  advisorySummary: string;
  actionPlan: AdvisoryActionPlan;
  createdAt: string;
  fieldName?: string;
}

export interface TreatmentProtocols {
  chemicalIntervention: string;
  organicAlternative: string;
  culturalPreventativeMeasures: string;
}

export interface PathologyScan {
  id: string;
  userId: string;
  fieldId?: string | null;
  cropName: string;
  imageUrl?: string | null;
  diagnosisLabel: string;
  severity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  pathogenType: string;
  symptomsObserved?: string[];
  treatmentProtocols: TreatmentProtocols;
  quarantineRequired?: boolean;
  createdAt: string;
  fieldName?: string;
}

export interface DashboardStats {
  totalAcres: number;
  registeredFieldsCount: number;
  advisoriesCount: number;
  scansCount: number;
  criticalRisksCount: number;
  averageSoilHealthScore: number;
  recentAdvisories: CropAdvisory[];
  recentScans: PathologyScan[];
}

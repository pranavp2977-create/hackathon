// server/lib/prompts.ts
import { Type } from '@google/genai';

export const AGRONOMY_SYSTEM_PROMPT = `You are AgriSmart AI, a world-class Agronomist, Soil Scientist, and Plant Pathologist.
Your task is to provide mathematically grounded, biologically accurate, and actionable agricultural crop recommendations and pathology triage.

Adhere to the following rules:
1. Every recommendation must take into account Nitrogen-Phosphorus-Potassium (NPK) ratios, pH tolerances, and seasonal precipitation constraints.
2. If soil pH is lower than 5.5 (Acidic), prescribe liming agents (Calcium Carbonate / Dolomite).
3. If soil pH is higher than 7.8 (Alkaline), prescribe elemental sulfur or gypsum.
4. Chemical treatment protocols must specify standard trade chemical names (e.g., Chlorpyrifos, Mancozeb, Azoxystrobin) alongside non-toxic, bio-fungicidal, and integrated pest management (IPM) alternatives.
5. All outputs must strictly conform to the provided JSON schemas without introductory or conversational filler.`;

export const cropAdvisorySchema = {
  type: Type.OBJECT,
  properties: {
    cropName: { type: Type.STRING },
    variety: { type: Type.STRING },
    confidenceScore: { type: Type.NUMBER, description: "Suitability score from 0.0 to 100.0" },
    projectedYieldQuintals: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    soilAmendments: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    lifecyclePhases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phaseName: { type: Type.STRING, description: "e.g., Sowing, Vegetative, Flowering, Maturity" },
          dayRange: { type: Type.STRING, description: "e.g., Days 1-15" },
          irrigationSchedule: { type: Type.STRING },
          fertilizationAction: { type: Type.STRING },
          pestSurveillance: { type: Type.STRING }
        },
        required: ["phaseName", "dayRange", "irrigationSchedule", "fertilizationAction", "pestSurveillance"]
      }
    },
    economicOutlook: {
      type: Type.OBJECT,
      properties: {
        estimatedCostPerAcre: { type: Type.NUMBER },
        estimatedRevenuePerAcre: { type: Type.NUMBER },
        recommendedMarketWindow: { type: Type.STRING }
      },
      required: ["estimatedCostPerAcre", "estimatedRevenuePerAcre", "recommendedMarketWindow"]
    }
  },
  required: [
    "cropName",
    "variety",
    "confidenceScore",
    "projectedYieldQuintals",
    "summary",
    "soilAmendments",
    "lifecyclePhases",
    "economicOutlook"
  ]
};

export const pathologyScanSchema = {
  type: Type.OBJECT,
  properties: {
    cropIdentified: { type: Type.STRING },
    diagnosisLabel: { type: Type.STRING },
    severity: { 
      type: Type.STRING, 
      enum: ["Low", "Moderate", "Severe", "Critical"] 
    },
    pathogenType: { 
      type: Type.STRING, 
      description: "Fungal, Bacterial, Viral, Insect Pest, or Nutritional Deficiency" 
    },
    symptomsObserved: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    treatments: {
      type: Type.OBJECT,
      properties: {
        chemicalIntervention: { type: Type.STRING },
        organicAlternative: { type: Type.STRING },
        culturalPreventativeMeasures: { type: Type.STRING }
      },
      required: ["chemicalIntervention", "organicAlternative", "culturalPreventativeMeasures"]
    },
    quarantineRequired: { type: Type.BOOLEAN }
  },
  required: [
    "cropIdentified",
    "diagnosisLabel",
    "severity",
    "pathogenType",
    "symptomsObserved",
    "treatments",
    "quarantineRequired"
  ]
};

// shared/validators.ts
import { z } from 'zod';

export const CreateFieldSchema = z.object({
  name: z.string().min(2, "Field name must be at least 2 characters").max(100),
  acreage: z.coerce.number().positive("Acreage must be greater than 0"),
  soilType: z.string().min(1, "Soil type is required"),
  irrigationType: z.string().min(1, "Irrigation type is required"),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  historicalNotes: z.string().max(1000).optional(),
});

export const GenerateAdvisoryInputSchema = z.object({
  fieldId: z.string().uuid("Invalid Field ID format"),
  cropPreferences: z.string().optional(),
  targetSeason: z.enum(["Kharif / Monsoon", "Rabi / Winter", "Zaid / Summer", "Perennial"]),
  soilMetrics: z.object({
    nitrogenPpm: z.coerce.number().min(0).max(1000),
    phosphorusPpm: z.coerce.number().min(0).max(1000),
    potassiumPpm: z.coerce.number().min(0).max(2000),
    ph: z.coerce.number().min(3.0).max(11.0),
    organicCarbonPercent: z.coerce.number().min(0).max(10).optional(),
  }),
  weatherContext: z.object({
    avgTemperatureCelsius: z.coerce.number().min(-20).max(60),
    rainfallForecastMm: z.coerce.number().min(0).max(5000),
    relativeHumidityPercent: z.coerce.number().min(0).max(100),
  })
});

export const PathologyScanInputSchema = z.object({
  fieldId: z.string().uuid().optional(),
  cropName: z.string().min(2, "Crop name is required"),
  imageBase64: z.string().min(100, "Valid base64 image data is required"),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

export type CreateFieldInput = z.infer<typeof CreateFieldSchema>;
export type GenerateAdvisoryInput = z.infer<typeof GenerateAdvisoryInputSchema>;
export type PathologyScanInput = z.infer<typeof PathologyScanInputSchema>;

// server/db.ts
import pg from 'pg';
import crypto from 'crypto';
import { User, Field, CropAdvisory, PathologyScan, DashboardStats } from '../shared/schema';
import { CreateFieldInput } from '../shared/validators';

const { Pool } = pg;

export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

let pool: pg.Pool | null = null;
let isPostgresAvailable = false;

// In-Memory Seed Storage for robust operation
const memoryDb = {
  users: new Map<string, User>(),
  fields: new Map<string, Field>(),
  cropAdvisories: new Map<string, CropAdvisory>(),
  pathologyScans: new Map<string, PathologyScan>(),
};

export async function initDatabase(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl && !databaseUrl.includes('localhost:5432/agrismart_db')) {
    try {
      pool = new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
      });
      await pool.query('SELECT NOW()');
      console.log('Successfully connected to PostgreSQL database.');
      isPostgresAvailable = true;
      await runMigrations();
      return;
    } catch (err) {
      console.warn('PostgreSQL connection failed, transitioning to resilient In-Memory Agronomic Store:', err);
      pool = null;
      isPostgresAvailable = false;
    }
  } else {
    console.log('DATABASE_URL not configured. Running with in-memory persistence and rich seed data.');
  }

  seedInMemoryData();
}

async function runMigrations(): Promise<void> {
  if (!pool) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        farm_name VARCHAR(255),
        region VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS fields (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(150) NOT NULL,
        acreage NUMERIC(10, 2) NOT NULL,
        soil_type VARCHAR(100) NOT NULL,
        irrigation_type VARCHAR(100) NOT NULL,
        latitude NUMERIC(10, 7),
        longitude NUMERIC(10, 7),
        historical_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crop_advisories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
        crop_name VARCHAR(150) NOT NULL,
        variety VARCHAR(150),
        confidence_score NUMERIC(5, 2) NOT NULL,
        soil_nitrogen_ppm NUMERIC(8, 2),
        soil_phosphorus_ppm NUMERIC(8, 2),
        soil_potassium_ppm NUMERIC(8, 2),
        soil_ph NUMERIC(4, 2),
        projected_yield_quintals_per_acre NUMERIC(8, 2),
        advisory_summary TEXT NOT NULL,
        action_plan JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pathology_scans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
        crop_name VARCHAR(150) NOT NULL,
        image_url TEXT,
        diagnosis_label VARCHAR(255) NOT NULL,
        severity VARCHAR(50) NOT NULL CHECK (severity IN ('Low', 'Moderate', 'Severe', 'Critical')),
        pathogen_type VARCHAR(100) NOT NULL,
        treatment_protocols JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
      CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON crop_advisories(user_id);
      CREATE INDEX IF NOT EXISTS idx_advisories_field_id ON crop_advisories(field_id);
      CREATE INDEX IF NOT EXISTS idx_pathology_user_id ON pathology_scans(user_id);
    `);
    console.log('Database tables verified and indexed.');
  } finally {
    client.release();
  }
}

function seedInMemoryData(): void {
  // Demo Tenant User
  const demoUser: User = {
    id: DEMO_USER_ID,
    email: "agronomist@agrismart.ai",
    fullName: "Dr. Evelyn Vance",
    farmName: "Vance Precision Agro-Ecosystems",
    region: "Indo-Gangetic Basin / Subtropical",
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };
  memoryDb.users.set(demoUser.id, demoUser);

  // 3 Diverse Seed Fields: Clay, Sandy Loam, and Black Cotton (as specified in Phase 1)
  const field1: Field = {
    id: "10000000-0000-0000-0000-000000000001",
    userId: DEMO_USER_ID,
    name: "North Ridge Basin (Plot Alpha)",
    acreage: 28.5,
    soilType: "Clay Loam",
    irrigationType: "Drip Irrigation (High Efficiency)",
    latitude: 28.6139,
    longitude: 77.2090,
    historicalNotes: "High water retention capacity, heavy clay matrix. Pre-treated with bio-char in 2024. Ideal for high-moisture feeding cereals.",
    createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
  };

  const field2: Field = {
    id: "10000000-0000-0000-0000-000000000002",
    userId: DEMO_USER_ID,
    name: "Sunward Terraces (Plot Beta)",
    acreage: 42.0,
    soilType: "Sandy Loam",
    irrigationType: "Sprinkler System",
    latitude: 28.6250,
    longitude: 77.2180,
    historicalNotes: "Rapid drainage soil profile, low organic carbon baseline (0.42%). Requires split nitrogen fertigation and periodic humic acid.",
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
  };

  const field3: Field = {
    id: "10000000-0000-0000-0000-000000000003",
    userId: DEMO_USER_ID,
    name: "Deccan Plateau Sector 4 (Plot Gamma)",
    acreage: 65.0,
    soilType: "Black Cotton Soil",
    irrigationType: "Flood / Furrow Irrigation",
    latitude: 19.0760,
    longitude: 72.8777,
    historicalNotes: "Deep montmorillonite black soil with high calcium and magnesium cation exchange capacity. Prone to deep shrink-swell cracking.",
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  };

  memoryDb.fields.set(field1.id, field1);
  memoryDb.fields.set(field2.id, field2);
  memoryDb.fields.set(field3.id, field3);

  // Seed Initial Advisories
  const advisory1: CropAdvisory = {
    id: "20000000-0000-0000-0000-000000000001",
    userId: DEMO_USER_ID,
    fieldId: field1.id,
    cropName: "Paddy (Rice)",
    variety: "Pusa Basmati 1509",
    confidenceScore: 96.5,
    soilNitrogenPpm: 120,
    soilPhosphorusPpm: 18,
    soilPotassiumPpm: 190,
    soilPh: 5.2, // Acidic: triggers lime
    projectedYieldQuintalsPerAcre: 26.5,
    advisorySummary: "Acidic soil profile (pH 5.2) with nitrogen deficit. Requires 2.5 t/ha agricultural limestone buffering prior to transplanting. Projected high market yield with split fertigation.",
    actionPlan: {
      cropName: "Paddy (Rice)",
      variety: "Pusa Basmati 1509",
      confidenceScore: 96.5,
      projectedYieldQuintals: 26.5,
      summary: "High market value aromatic grain. Clay Loam holds moisture efficiently, lowering seasonal irrigation expenditure.",
      soilAmendments: [
        "CRITICAL ACIDITY (pH 5.2): Apply Dolomitic Limestone @ 2.5 t/ha 3 weeks before puddling to neutralize toxic aluminum ions.",
        "LOW NITROGEN (120 ppm): Apply basal Urea (46% N) @ 45 kg/acre + Neem-coated top-dress splits at active tillering.",
        "DEFICIENT PHOSPHORUS (18 ppm): Drill Single Super Phosphate (SSP) @ 60 kg/acre."
      ],
      lifecyclePhases: [
        {
          phaseName: "Nursery & Sowing",
          dayRange: "Days 1 - 25",
          irrigationSchedule: "Maintain 2-3 cm shallow water layer in nursery bed.",
          fertilizationAction: "Basal DAP 10 kg + Zinc Sulphate heptahydrate 2 kg per nursery acre.",
          pestSurveillance: "Seed treatment with carbendazim 2g/kg against blast and bakanae disease."
        },
        {
          phaseName: "Transplanting & Tillering",
          dayRange: "Days 26 - 55",
          irrigationSchedule: "Maintain 5 cm standing water during initial 3 weeks, then alternate wetting and drying (AWD).",
          fertilizationAction: "First split of Neem-Coated Urea (35 kg/acre) + 5 kg Zinc Sulphate at 21 DAT.",
          pestSurveillance: "Monitor stem borer dead hearts; install pheromone traps (8/acre)."
        },
        {
          phaseName: "Panicle Initiation & Flowering",
          dayRange: "Days 56 - 90",
          irrigationSchedule: "Keep field flooded with 5 cm water; avoid any drought stress during anthesis.",
          fertilizationAction: "Final nitrogen top-dressing (25 kg Urea/acre) + 00:52:34 foliar spray @ 1.5%.",
          pestSurveillance: "Foliar spray of Azoxystrobin + Difenoconazole against sheath blight."
        },
        {
          phaseName: "Grain Hardening & Harvesting",
          dayRange: "Days 91 - 120",
          irrigationSchedule: "Drain standing water completely 10-12 days before combine harvest.",
          fertilizationAction: "Cease all soil fertilization to ensure natural senescence.",
          pestSurveillance: "Inspect for brown planthopper (BPH) at base of tillers."
        }
      ],
      economicOutlook: {
        estimatedCostPerAcre: 21500,
        estimatedRevenuePerAcre: 71000,
        recommendedMarketWindow: "October - November Peak Mandi Arrival"
      }
    },
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    fieldName: field1.name
  };

  memoryDb.cropAdvisories.set(advisory1.id, advisory1);

  // Seed Initial Pathology Scans
  const scan1: PathologyScan = {
    id: "30000000-0000-0000-0000-000000000001",
    userId: DEMO_USER_ID,
    fieldId: field1.id,
    cropName: "Paddy (Rice)",
    imageUrl: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23132e18'/><path d='M200 40 C140 100, 100 200, 200 260 C300 200, 260 100, 200 40' fill='%23347d39'/><circle cx='185' cy='130' r='18' fill='%23a16207'/><circle cx='215' cy='175' r='14' fill='%23854d0e'/><circle cx='195' cy='210' r='12' fill='%23713f12'/></svg>",
    diagnosisLabel: "Brown Spot (Bipolaris oryzae)",
    severity: "Moderate",
    pathogenType: "Fungal",
    symptomsObserved: [
      "Circular to oval brown spots with grey or whitish centers on leaf blades",
      "Yellow halo surrounding active lesions",
      "Reduced panicle grain filling and glume discoloration"
    ],
    treatmentProtocols: {
      chemicalIntervention: "Foliar spray of Mancozeb 75% WP @ 2.5g/L or Propiconazole 25% EC (Tilt) @ 1.0ml/L water.",
      organicAlternative: "Foliar application of Pseudomonas fluorescens (biovar 1) @ 10g/L + Neem oil 10,000 ppm @ 2ml/L.",
      culturalPreventativeMeasures: "Correct potassium and silicon deficiencies in soil, avoid drought stress in nursery, and burn severely affected stubble."
    },
    quarantineRequired: false,
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    fieldName: field1.name
  };

  const scan2: PathologyScan = {
    id: "30000000-0000-0000-0000-000000000002",
    userId: DEMO_USER_ID,
    fieldId: field3.id,
    cropName: "Cotton",
    imageUrl: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%231a201c'/><path d='M100 200 Q200 60 300 200 Q200 280 100 200' fill='%234d7c0f'/><line x1='120' y1='180' x2='280' y2='220' stroke='%23dc2626' stroke-width='6'/><circle cx='160' cy='160' r='12' fill='%23ef4444'/></svg>",
    diagnosisLabel: "Cotton Leaf Curl Virus (CLCuV)",
    severity: "Critical",
    pathogenType: "Viral",
    symptomsObserved: [
      "Pronounced upward and downward leaf curling",
      "Vein thickening and enation (leaf-like outgrowths) on underside of leaves",
      "Stunted growth and boll dropping"
    ],
    treatmentProtocols: {
      chemicalIntervention: "Control vector whitefly (Bemisia tabaci) with Diafenthiuron 50% WP @ 1.25g/L or Pyriproxyfen 10% EC @ 2ml/L.",
      organicAlternative: "Spray Verticillium lecanii bio-insecticide @ 5g/L with fish oil rosin soap @ 2ml/L.",
      culturalPreventativeMeasures: "Eradicate weed host reservoirs immediately, install yellow sticky traps (25/acre), and rogue out infected plants."
    },
    quarantineRequired: true,
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    fieldName: field3.name
  };

  memoryDb.pathologyScans.set(scan1.id, scan1);
  memoryDb.pathologyScans.set(scan2.id, scan2);
  console.log('Seeded in-memory store with demo tenant, 3 diverse plots, historical advisories, and pathology scans.');
}

// ==========================================
// Database Query Operations with Tenant RLS
// ==========================================

export async function getUser(userId: string): Promise<User | null> {
  if (isPostgresAvailable && pool) {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return res.rows[0] || null;
  }
  return memoryDb.users.get(userId) || null;
}

export async function getFields(userId: string): Promise<Field[]> {
  if (isPostgresAvailable && pool) {
    const res = await pool.query('SELECT * FROM fields WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      name: r.name,
      acreage: Number(r.acreage),
      soilType: r.soil_type,
      irrigationType: r.irrigation_type,
      latitude: r.latitude ? Number(r.latitude) : undefined,
      longitude: r.longitude ? Number(r.longitude) : undefined,
      historicalNotes: r.historical_notes,
      createdAt: r.created_at.toISOString()
    }));
  }

  return Array.from(memoryDb.fields.values())
    .filter(f => f.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getFieldById(userId: string, fieldId: string): Promise<Field | null> {
  const fields = await getFields(userId);
  return fields.find(f => f.id === fieldId) || null;
}

export async function createField(userId: string, input: CreateFieldInput): Promise<Field> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  if (isPostgresAvailable && pool) {
    const res = await pool.query(
      `INSERT INTO fields (id, user_id, name, acreage, soil_type, irrigation_type, latitude, longitude, historical_notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, userId, input.name, input.acreage, input.soilType, input.irrigationType, input.latitude ?? null, input.longitude ?? null, input.historicalNotes ?? null, createdAt]
    );
    const r = res.rows[0];
    return {
      id: r.id,
      userId: r.user_id,
      name: r.name,
      acreage: Number(r.acreage),
      soilType: r.soil_type,
      irrigationType: r.irrigation_type,
      latitude: r.latitude ? Number(r.latitude) : undefined,
      longitude: r.longitude ? Number(r.longitude) : undefined,
      historicalNotes: r.historical_notes,
      createdAt: r.created_at.toISOString()
    };
  }

  const newField: Field = {
    id,
    userId,
    name: input.name,
    acreage: input.acreage,
    soilType: input.soilType,
    irrigationType: input.irrigationType,
    latitude: input.latitude,
    longitude: input.longitude,
    historicalNotes: input.historicalNotes,
    createdAt
  };
  memoryDb.fields.set(id, newField);
  return newField;
}

export async function getCropAdvisories(userId: string): Promise<CropAdvisory[]> {
  const fields = await getFields(userId);
  const fieldMap = new Map(fields.map(f => [f.id, f.name]));

  if (isPostgresAvailable && pool) {
    const res = await pool.query('SELECT * FROM crop_advisories WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      fieldId: r.field_id,
      cropName: r.crop_name,
      variety: r.variety,
      confidenceScore: Number(r.confidence_score),
      soilNitrogenPpm: r.soil_nitrogen_ppm ? Number(r.soil_nitrogen_ppm) : null,
      soilPhosphorusPpm: r.soil_phosphorus_ppm ? Number(r.soil_phosphorus_ppm) : null,
      soilPotassiumPpm: r.soil_potassium_ppm ? Number(r.soil_potassium_ppm) : null,
      soilPh: r.soil_ph ? Number(r.soil_ph) : null,
      projectedYieldQuintalsPerAcre: r.projected_yield_quintals_per_acre ? Number(r.projected_yield_quintals_per_acre) : null,
      advisorySummary: r.advisory_summary,
      actionPlan: r.action_plan,
      createdAt: r.created_at.toISOString(),
      fieldName: r.field_id ? fieldMap.get(r.field_id) : undefined
    }));
  }

  return Array.from(memoryDb.cropAdvisories.values())
    .filter(a => a.userId === userId)
    .map(a => ({
      ...a,
      fieldName: a.fieldId ? fieldMap.get(a.fieldId) : undefined
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getCropAdvisoryById(userId: string, id: string): Promise<CropAdvisory | null> {
  const advisories = await getCropAdvisories(userId);
  return advisories.find(a => a.id === id) || null;
}

export async function createCropAdvisory(
  userId: string,
  fieldId: string | null,
  cropName: string,
  variety: string,
  confidenceScore: number,
  soilNitrogenPpm: number,
  soilPhosphorusPpm: number,
  soilPotassiumPpm: number,
  soilPh: number,
  projectedYieldQuintalsPerAcre: number,
  advisorySummary: string,
  actionPlan: any
): Promise<CropAdvisory> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const field = fieldId ? await getFieldById(userId, fieldId) : null;

  if (isPostgresAvailable && pool) {
    await pool.query(
      `INSERT INTO crop_advisories (
        id, user_id, field_id, crop_name, variety, confidence_score,
        soil_nitrogen_ppm, soil_phosphorus_ppm, soil_potassium_ppm, soil_ph,
        projected_yield_quintals_per_acre, advisory_summary, action_plan, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        id, userId, fieldId, cropName, variety, confidenceScore,
        soilNitrogenPpm, soilPhosphorusPpm, soilPotassiumPpm, soilPh,
        projectedYieldQuintalsPerAcre, advisorySummary, JSON.stringify(actionPlan), createdAt
      ]
    );
  }

  const advisory: CropAdvisory = {
    id,
    userId,
    fieldId,
    cropName,
    variety,
    confidenceScore,
    soilNitrogenPpm,
    soilPhosphorusPpm,
    soilPotassiumPpm,
    soilPh,
    projectedYieldQuintalsPerAcre,
    advisorySummary,
    actionPlan,
    createdAt,
    fieldName: field?.name
  };

  memoryDb.cropAdvisories.set(id, advisory);
  return advisory;
}

export async function getPathologyScans(userId: string): Promise<PathologyScan[]> {
  const fields = await getFields(userId);
  const fieldMap = new Map(fields.map(f => [f.id, f.name]));

  if (isPostgresAvailable && pool) {
    const res = await pool.query('SELECT * FROM pathology_scans WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      fieldId: r.field_id,
      cropName: r.crop_name,
      imageUrl: r.image_url,
      diagnosisLabel: r.diagnosis_label,
      severity: r.severity,
      pathogenType: r.pathogen_type,
      treatmentProtocols: r.treatment_protocols,
      createdAt: r.created_at.toISOString(),
      fieldName: r.field_id ? fieldMap.get(r.field_id) : undefined
    }));
  }

  return Array.from(memoryDb.pathologyScans.values())
    .filter(s => s.userId === userId)
    .map(s => ({
      ...s,
      fieldName: s.fieldId ? fieldMap.get(s.fieldId) : undefined
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createPathologyScan(
  userId: string,
  fieldId: string | null,
  cropName: string,
  imageUrl: string | null,
  diagnosisLabel: string,
  severity: 'Low' | 'Moderate' | 'Severe' | 'Critical',
  pathogenType: string,
  treatmentProtocols: any,
  symptomsObserved?: string[],
  quarantineRequired?: boolean
): Promise<PathologyScan> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const field = fieldId ? await getFieldById(userId, fieldId) : null;

  if (isPostgresAvailable && pool) {
    await pool.query(
      `INSERT INTO pathology_scans (
        id, user_id, field_id, crop_name, image_url, diagnosis_label, severity,
        pathogen_type, treatment_protocols, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, userId, fieldId, cropName, imageUrl, diagnosisLabel, severity, pathogenType, JSON.stringify(treatmentProtocols), createdAt]
    );
  }

  const scan: PathologyScan = {
    id,
    userId,
    fieldId,
    cropName,
    imageUrl,
    diagnosisLabel,
    severity,
    pathogenType,
    treatmentProtocols,
    symptomsObserved,
    quarantineRequired,
    createdAt,
    fieldName: field?.name
  };

  memoryDb.pathologyScans.set(id, scan);
  return scan;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const fields = await getFields(userId);
  const advisories = await getCropAdvisories(userId);
  const scans = await getPathologyScans(userId);

  const totalAcres = fields.reduce((sum, f) => sum + (f.acreage || 0), 0);
  const criticalRisksCount = scans.filter(s => s.severity === 'Critical' || s.severity === 'Severe').length;

  return {
    totalAcres: Math.round(totalAcres * 10) / 10,
    registeredFieldsCount: fields.length,
    advisoriesCount: advisories.length,
    scansCount: scans.length,
    criticalRisksCount,
    averageSoilHealthScore: advisories.length > 0
      ? Math.round(advisories.reduce((acc, a) => acc + (a.confidenceScore || 90), 0) / advisories.length)
      : 88,
    recentAdvisories: advisories.slice(0, 5),
    recentScans: scans.slice(0, 5)
  };
}

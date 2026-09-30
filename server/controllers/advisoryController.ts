// server/controllers/advisoryController.ts
import { Request, Response } from 'express';
import { GenerateAdvisoryInputSchema } from '../../shared/validators';
import * as db from '../db';
import { generateCropAdvisoryAI } from '../lib/gemini';

export async function listAdvisories(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const advisories = await db.getCropAdvisories(userId);
    res.json(advisories);
  } catch (err: any) {
    console.error('Error fetching advisories:', err);
    res.status(500).json({ error: 'Failed to retrieve crop advisories', details: err.message });
  }
}

export async function getAdvisory(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const { id } = req.params;
    const advisory = await db.getCropAdvisoryById(userId, id);
    if (!advisory) {
      res.status(404).json({ error: 'Crop advisory plan not found' });
      return;
    }
    res.json(advisory);
  } catch (err: any) {
    console.error('Error retrieving advisory:', err);
    res.status(500).json({ error: 'Failed to retrieve advisory', details: err.message });
  }
}

export async function generateAdvisory(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const validation = GenerateAdvisoryInputSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed on advisory telemetry parameters',
        issues: validation.error.issues
      });
      return;
    }

    const input = validation.data;
    const field = await db.getFieldById(userId, input.fieldId);
    if (!field) {
      res.status(404).json({ error: 'Selected field parcel not found under current tenant' });
      return;
    }

    const plan = await generateCropAdvisoryAI(input, {
      name: field.name,
      soilType: field.soilType,
      acreage: field.acreage,
      irrigationType: field.irrigationType
    });

    const advisory = await db.createCropAdvisory(
      userId,
      field.id,
      plan.cropName,
      plan.variety,
      plan.confidenceScore,
      input.soilMetrics.nitrogenPpm,
      input.soilMetrics.phosphorusPpm,
      input.soilMetrics.potassiumPpm,
      input.soilMetrics.ph,
      plan.projectedYieldQuintals,
      plan.summary,
      plan
    );

    res.status(201).json(advisory);
  } catch (err: any) {
    console.error('Error synthesizing agronomic advisory:', err);
    res.status(500).json({ error: 'Agronomic advisory synthesis failed', details: err.message });
  }
}

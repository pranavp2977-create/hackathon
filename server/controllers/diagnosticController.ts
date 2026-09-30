// server/controllers/diagnosticController.ts
import { Request, Response } from 'express';
import { PathologyScanInputSchema } from '../../shared/validators';
import * as db from '../db';
import { analyzeLeafPathologyAI } from '../lib/gemini';

export async function listScans(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const scans = await db.getPathologyScans(userId);
    res.json(scans);
  } catch (err: any) {
    console.error('Error fetching pathology scans:', err);
    res.status(500).json({ error: 'Failed to retrieve pathology scans', details: err.message });
  }
}

export async function scanLeaf(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const validation = PathologyScanInputSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed on leaf diagnostic payload',
        issues: validation.error.issues
      });
      return;
    }

    const { fieldId, cropName, imageBase64, mimeType } = validation.data;

    // Check payload size limit (10MB max)
    const approximateByteSize = (imageBase64.length * 3) / 4;
    if (approximateByteSize > 10 * 1024 * 1024) {
      res.status(413).json({ error: 'Payload Too Large: Leaf specimen image exceeds 10MB limit.' });
      return;
    }

    // Call Gemini 2.5 Flash Vision Multimodal Diagnostic Triage
    const pathologyResult = await analyzeLeafPathologyAI({
      fieldId,
      cropName,
      imageBase64,
      mimeType
    });

    // Save scan result to database
    const scan = await db.createPathologyScan(
      userId,
      fieldId || null,
      cropName,
      imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType};base64,${imageBase64}`,
      pathologyResult.diagnosisLabel,
      pathologyResult.severity,
      pathologyResult.pathogenType,
      pathologyResult.treatments,
      pathologyResult.symptomsObserved,
      pathologyResult.quarantineRequired
    );

    res.status(201).json(scan);
  } catch (err: any) {
    console.error('Error executing leaf pathology scan:', err);
    res.status(500).json({ error: 'Pathology diagnosis scan failed', details: err.message });
  }
}

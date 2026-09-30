// server/controllers/fieldController.ts
import { Request, Response } from 'express';
import { CreateFieldSchema } from '../../shared/validators';
import * as db from '../db';

export async function listFields(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const fields = await db.getFields(userId);
    res.json(fields);
  } catch (err: any) {
    console.error('Error fetching fields:', err);
    res.status(500).json({ error: 'Failed to retrieve fields', details: err.message });
  }
}

export async function createField(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const validation = CreateFieldSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        issues: validation.error.issues
      });
      return;
    }

    const field = await db.createField(userId, validation.data);
    res.status(201).json(field);
  } catch (err: any) {
    console.error('Error creating field:', err);
    res.status(500).json({ error: 'Failed to create field', details: err.message });
  }
}

export async function getField(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const { id } = req.params;
    const field = await db.getFieldById(userId, id);
    if (!field) {
      res.status(404).json({ error: 'Field plot not found' });
      return;
    }
    res.json(field);
  } catch (err: any) {
    console.error('Error fetching field by id:', err);
    res.status(500).json({ error: 'Failed to retrieve field', details: err.message });
  }
}

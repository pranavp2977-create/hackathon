// server/routes.ts
import { Router } from 'express';
import * as fieldController from './controllers/fieldController';
import * as advisoryController from './controllers/advisoryController';
import * as diagnosticController from './controllers/diagnosticController';
import * as db from './db';

const router = Router();

// Tenant Profile
router.get('/tenant', async (req, res) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const user = await db.getUser(userId);
    res.json(user || {
      id: db.DEMO_USER_ID,
      email: "agronomist@agrismart.ai",
      fullName: "Dr. Evelyn Vance",
      farmName: "Vance Precision Agro-Ecosystems",
      region: "Indo-Gangetic Basin / Subtropical"
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve tenant info', details: err.message });
  }
});

// Dashboard Aggregates
router.get('/dashboard/stats', async (req, res) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || db.DEMO_USER_ID;
    const stats = await db.getDashboardStats(userId);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compute dashboard stats', details: err.message });
  }
});

// Operational Fields Endpoints
router.get('/fields', fieldController.listFields);
router.post('/fields', fieldController.createField);
router.get('/fields/:id', fieldController.getField);

// Agronomic Advisory Endpoints
router.get('/advisories', advisoryController.listAdvisories);
router.get('/advisories/:id', advisoryController.getAdvisory);
router.post('/advisories/generate', advisoryController.generateAdvisory);

// Multimodal Visual Diagnostics Endpoints
router.get('/diagnostics', diagnosticController.listScans);
router.post('/diagnostics/scan', diagnosticController.scanLeaf);

export default router;

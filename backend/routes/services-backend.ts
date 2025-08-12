import express from 'express';
import { UdyamiApi } from '../api';

const router = express.Router();
const api = new UdyamiApi();

// 🔹 POST /api/services → Create a service
router.post('/', async (req, res) => {
  try {
    const result = await api.createService(req.body);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.status(201).json(result.data);
  } catch (error) {
    console.error('❌ Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// 🔹 GET /api/services → Get all services
router.get('/', async (req, res) => {
  try {
    const result = await api.getServices();
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json(result.data);
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// 🔹 GET /api/services/seller/:sellerId → Get services by seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const result = await api.getServices(sellerId);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json(result.data);
  } catch (error) {
    console.error('❌ Error fetching seller services:', error);
    res.status(500).json({ error: 'Failed to fetch seller services' });
  }
});

export default router;

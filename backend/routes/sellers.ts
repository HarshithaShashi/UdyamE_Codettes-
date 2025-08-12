import express from 'express';
import { UdyamiApi } from '../api';

const router = express.Router();
const api = new UdyamiApi();

// 🔹 POST /api/sellers → Create a seller profile
router.post('/', async (req, res) => {
  try {
    const result = await api.createSeller(req.body);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.status(201).json(result.data);
  } catch (error) {
    console.error('❌ Error creating seller:', error);
    res.status(500).json({ error: 'Failed to create seller' });
  }
});

// 🔹 GET /api/sellers → Get all sellers with filters
router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const result = await api.getSellers(filters);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json(result.data);
  } catch (error) {
    console.error('❌ Error fetching sellers:', error);
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
});

// 🔹 GET /api/sellers/:id → Get seller by ID
router.get('/:id', async (req, res) => {
  try {
    const sellerId = req.params.id;
    const result = await api.getSellers({ id: sellerId });
    
    if (result.status === 'error' || result.data.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    
    res.json(result.data[0]);
  } catch (error) {
    console.error('❌ Error fetching seller:', error);
    res.status(500).json({ error: 'Failed to fetch seller' });
  }
});

export default router;

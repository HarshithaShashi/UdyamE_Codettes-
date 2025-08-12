import express from 'express';
import { UdyamiApi } from '../api';

const router = express.Router();
const api = new UdyamiApi();

// 🔹 POST /api/notifications → Create a notification
router.post('/', async (req, res) => {
  try {
    const result = await api.createNotification(req.body);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.status(201).json(result.data);
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// 🔹 GET /api/notifications/user/:userId → Get notifications by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await api.getNotifications(userId);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json(result.data);
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;

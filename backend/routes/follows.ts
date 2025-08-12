import express from 'express';
import { UdyamiApi } from '../api';

const router = express.Router();
const api = new UdyamiApi();

// 🔹 POST /api/follows → Follow a seller
router.post('/', async (req, res) => {
  try {
    const { sellerId, followerId } = req.body;
    
    if (!sellerId || !followerId) {
      return res.status(400).json({ error: 'Seller ID and follower ID are required' });
    }
    
    const result = await api.followSeller(sellerId, followerId);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json({ message: 'Followed successfully', data: result.data });
  } catch (error) {
    console.error('❌ Error following seller:', error);
    res.status(500).json({ error: 'Failed to follow seller' });
  }
});

// 🔹 DELETE /api/follows → Unfollow a seller
router.delete('/', async (req, res) => {
  try {
    const { sellerId, followerId } = req.body;
    
    if (!sellerId || !followerId) {
      return res.status(400).json({ error: 'Seller ID and follower ID are required' });
    }
    
    const result = await api.unfollowSeller(sellerId, followerId);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json({ message: 'Unfollowed successfully', data: result.data });
  } catch (error) {
    console.error('❌ Error unfollowing seller:', error);
    res.status(500).json({ error: 'Failed to unfollow seller' });
  }
});

// 🔹 GET /api/follows/user/:userId → Get followed sellers by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // This would need to be implemented in the API class
    // For now, returning empty array
    res.json([]);
  } catch (error) {
    console.error('❌ Error fetching followed sellers:', error);
    res.status(500).json({ error: 'Failed to fetch followed sellers' });
  }
});

export default router;

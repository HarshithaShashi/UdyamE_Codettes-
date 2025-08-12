import express from 'express';
import { UdyamiApi } from '../api';

const router = express.Router();
const api = new UdyamiApi();

// 🔹 POST /api/users → Create a user
router.post('/', async (req, res) => {
  try {
    const { name, phoneNumber, email, role, language, location } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ error: 'Name and phone number are required.' });
    }

    const result = await api.createUser({
      name,
      phoneNumber,
      email,
      role,
      language,
      location,
    });

    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }

    res.status(201).json(result.data);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// 🔹 GET /api/users/:id → Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const result = await api.getUser(userId);

    if (result.status === 'error') {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.data);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// 🔹 GET /api/users/phone/:phoneNumber → Get user by phone number
router.get('/phone/:phoneNumber', async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const result = await api.getUserByPhone(phoneNumber);

    if (result.status === 'error') {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.data);
  } catch (error) {
    console.error('❌ Error fetching user by phone:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// 🔹 PUT /api/users/:id → Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const result = await api.updateUser(userId, userData);

    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }

    res.json(result.data);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;

import express from 'express';
import { UdyamiApi } from '../api';

const router = express.Router();
const api = new UdyamiApi();

// 🔹 POST /api/jobs → Create a job
router.post('/', async (req, res) => {
  try {
    const result = await api.createJob(req.body);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.status(201).json(result.data);
  } catch (error) {
    console.error('❌ Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// 🔹 GET /api/jobs → Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const result = await api.getJobs(filters);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json(result.data);
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// 🔹 GET /api/jobs/user/:userId → Get jobs by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await api.getJobs({ buyerId: userId });
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json(result.data);
  } catch (error) {
    console.error('❌ Error fetching user jobs:', error);
    res.status(500).json({ error: 'Failed to fetch user jobs' });
  }
});

// 🔹 PUT /api/jobs/:id/status → Update job status
router.put('/:id/status', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const result = await api.updateJobStatus(jobId, status);
    
    if (result.status === 'error') {
      return res.status(500).json({ error: result.message });
    }
    
    res.json(result.data);
  } catch (error) {
    console.error('❌ Error updating job status:', error);
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

export default router;

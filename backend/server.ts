// server.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/user';
import sellerRoutes from './routes/sellers';
import jobRoutes from './routes/jobs';
import serviceRoutes from './routes/services-backend';
import followRoutes from './routes/follows';
import notificationRoutes from './routes/notifications';
import locationSearchRoutes from './routes/locationSearch';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', locationSearchRoutes);

// Health check
app.get('/', (_, res) => {
  res.send('Udyami Backend is Running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

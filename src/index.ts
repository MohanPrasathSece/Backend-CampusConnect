import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import lostFoundRoutes from './routes/lostfound.routes.js';
import timetableRoutes from './routes/timetable.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import skillRoutes from './routes/skill.routes.js';
import techNewsRoutes from './routes/technews.routes.js';
import pollRoutes from './routes/poll.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/lostfound', lostFoundRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/technews', techNewsRoutes);
app.use('/api/polls', pollRoutes);

// Root health check
app.get('/', (_, res) => res.send('CampusLink API running'));

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

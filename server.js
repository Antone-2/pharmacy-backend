import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import contactRoutes from './routes/contact.js';
import testimonialRoutes from './routes/testimonial.js';
import healthTipRoutes from './routes/healthTip.js';
import faqRoutes from './routes/faq.js';
import { sendEmail, notifyAdmin, sendConfirmation } from './services/emailService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/health-tips', healthTipRoutes);
app.use('/api/faq', faqRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/test-email', async (req, res) => {
  try {
    console.log('Testing email to:', process.env.ADMIN_EMAIL);
    await sendEmail(process.env.ADMIN_EMAIL, 'Admin', 'Test Email', '<p>Test email from Gamsel Pharmacy API.</p>');
    res.json({ message: 'Email sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/test-contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log('Test contact:', { name, email, phone, message });
    
    await notifyAdmin({ name, email, phone, message });
    if (email) {
      await sendConfirmation(email, name);
    }
    
    res.json({ message: 'Email notifications sent' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const MONGO_URI = process.env.MONGO_URI;

async function start() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI, { 
        tls: true, 
        tlsAllowInvalidCertificates: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000
      });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      console.log('Starting server WITHOUT MongoDB - emails will still work');
    }
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { sendEmail, notifyAdmin } from './services/emailService.js';

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test-email', async (req, res) => {
  try {
    console.log('Testing email...');
    await sendEmail(process.env.ADMIN_EMAIL, 'Admin', 'Test Email', '<p>This is a test email from Gamsel Pharmacy API.</p>');
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
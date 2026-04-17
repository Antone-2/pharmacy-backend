const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let healthTips = [];

app.get('/api/health-tips', (req, res) => {
  res.json(healthTips.filter(h => h.isActive !== false));
});

app.post('/api/health-tips', (req, res) => {
  const tip = { _id: Date.now().toString(), ...req.body, isActive: true, createdAt: new Date() };
  healthTips.push(tip);
  res.status(201).json(tip);
});

app.put('/api/health-tips/:id', (req, res) => {
  const index = healthTips.findIndex(h => h._id === req.params.id);
  if (index !== -1) {
    healthTips[index] = { ...healthTips[index], ...req.body };
    res.json(healthTips[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/health-tips/:id', (req, res) => {
  healthTips = healthTips.filter(h => h._id !== req.params.id);
  res.json({ message: 'Health tip deleted' });
});

describe('Health Tips API', () => {
  beforeEach(() => {
    healthTips = [];
  });

  test('GET /api/health-tips returns active tips', async () => {
    healthTips.push({ _id: '1', title: 'Tip 1', content: 'Content 1', isActive: true });
    healthTips.push({ _id: '2', title: 'Tip 2', content: 'Content 2', isActive: false });
    
    const res = await request(app).get('/api/health-tips');
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Tip 1');
  });

  test('POST /api/health-tips creates tip', async () => {
    const res = await request(app)
      .post('/api/health-tips')
      .send({ title: 'Drink Water', content: 'Stay hydrated', category: 'Droplets' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Drink Water');
  });
});
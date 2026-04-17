const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let faqs = [];

app.get('/api/faq', (req, res) => {
  res.json(faqs.filter(f => f.isActive !== false).sort((a, b) => a.order - b.order));
});

app.post('/api/faq', (req, res) => {
  const faq = { _id: Date.now().toString(), ...req.body, isActive: true, createdAt: new Date() };
  faqs.push(faq);
  res.status(201).json(faq);
});

app.put('/api/faq/:id', (req, res) => {
  const index = faqs.findIndex(f => f._id === req.params.id);
  if (index !== -1) {
    faqs[index] = { ...faqs[index], ...req.body };
    res.json(faqs[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/faq/:id', (req, res) => {
  faqs = faqs.filter(f => f._id !== req.params.id);
  res.json({ message: 'FAQ deleted' });
});

describe('FAQ API', () => {
  beforeEach(() => {
    faqs = [];
  });

  test('GET /api/faq returns sorted faqs', async () => {
    faqs.push({ _id: '1', question: 'Q2', answer: 'A2', order: 2, isActive: true });
    faqs.push({ _id: '2', question: 'Q1', answer: 'A1', order: 1, isActive: true });
    
    const res = await request(app).get('/api/faq');
    expect(res.body[0].question).toBe('Q1');
    expect(res.body[1].question).toBe('Q2');
  });

  test('POST /api/faq creates faq', async () => {
    const res = await request(app)
      .post('/api/faq')
      .send({ question: 'What hours?', answer: '8am-8pm', order: 1 });
    expect(res.status).toBe(201);
    expect(res.body.question).toBe('What hours?');
  });
});
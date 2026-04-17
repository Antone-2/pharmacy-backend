const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let testimonials = [];

app.get('/api/testimonials', (req, res) => {
  res.json(testimonials.filter(t => t.isActive !== false));
});

app.post('/api/testimonials', (req, res) => {
  const testimonial = { _id: Date.now().toString(), ...req.body, isActive: true, createdAt: new Date() };
  testimonials.push(testimonial);
  res.status(201).json(testimonial);
});

app.put('/api/testimonials/:id', (req, res) => {
  const index = testimonials.findIndex(t => t._id === req.params.id);
  if (index !== -1) {
    testimonials[index] = { ...testimonials[index], ...req.body };
    res.json(testimonials[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/testimonials/:id', (req, res) => {
  testimonials = testimonials.filter(t => t._id !== req.params.id);
  res.json({ message: 'Testimonial deleted' });
});

describe('Testimonials API', () => {
  beforeEach(() => {
    testimonials = [];
  });

  test('GET /api/testimonials returns empty array initially', async () => {
    const res = await request(app).get('/api/testimonials');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/testimonials creates testimonial', async () => {
    const res = await request(app)
      .post('/api/testimonials')
      .send({ name: 'Mary Akello', role: 'Patient', content: 'Great service!', rating: 5 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Mary Akello');
    expect(res.body.rating).toBe(5);
  });

  test('GET /api/testimonials returns active only', async () => {
    testimonials.push({ _id: '1', name: 'Active', isActive: true });
    testimonials.push({ _id: '2', name: 'Inactive', isActive: false });
    
    const res = await request(app).get('/api/testimonials');
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Active');
  });
});
const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let contacts = [];

app.post('/api/contact', (req, res) => {
  const contact = { _id: Date.now().toString(), ...req.body, createdAt: new Date() };
  contacts.push(contact);
  res.status(201).json(contact);
});

app.get('/api/contact', (req, res) => {
  res.json(contacts);
});

app.delete('/api/contact/:id', (req, res) => {
  contacts = contacts.filter(c => c._id !== req.params.id);
  res.json({ message: 'Contact deleted' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

describe('Contact API', () => {
  beforeEach(() => {
    contacts = [];
  });

  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /api/contact creates new contact', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'John Doe', email: 'john@example.com', phone: '1234567890', message: 'Test message' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('John Doe');
    expect(res.body.email).toBe('john@example.com');
  });

  test('GET /api/contact returns all contacts', async () => {
    await request(app).post('/api/contact').send({ name: 'John', email: 'john@example.com', phone: '123', message: 'Hi' });
    await request(app).post('/api/contact').send({ name: 'Jane', email: 'jane@example.com', phone: '456', message: 'Hello' });
    
    const res = await request(app).get('/api/contact');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('DELETE /api/contact/:id removes contact', async () => {
    const createRes = await request(app)
      .post('/api/contact')
      .send({ name: 'John', email: 'john@example.com', phone: '123', message: 'Hi' });
    const id = createRes.body._id;

    const res = await request(app).delete(`/api/contact/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Contact deleted');
  });
});
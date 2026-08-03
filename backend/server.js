require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDb } = require('./db');

const app = express();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
const frontendUrl = process.env.FRONTEND_URL || '*';

const pairCodes = new Map();

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: frontendUrl === '*' ? true : frontendUrl, credentials: true }));

function createTempCode() {
  return String(Math.floor(Math.random() * 90) + 10);
}

function createSessionToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '30d' });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

async function ordersCollection() {
  const db = await getDb();
  return db.collection('orders');
}

async function driversCollection() {
  const db = await getDb();
  return db.collection('drivers');
}

async function driverLocationsCollection() {
  const db = await getDb();
  return db.collection('driver_locations');
}

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'telegas-api' });
});

app.post('/admin/pair/request', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Informe o e-mail.' });

  const code = createTempCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  pairCodes.set(email, { email, code, expiresAt });
  res.json({ ok: true, email, code, expiresAt });
});

app.post('/admin/pair/confirm', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const code = String(req.body?.code || '').trim();
  if (!email || !code) return res.status(400).json({ error: 'Informe o e-mail e o código.' });

  const record = pairCodes.get(email);
  if (!record || record.expiresAt < Date.now() || record.code !== code) {
    return res.status(401).json({ error: 'Código inválido ou expirado.' });
  }

  pairCodes.delete(email);
  const session = {
    email,
    token: createSessionToken({ email, role: 'admin' }),
    trustedAt: new Date().toISOString()
  };

  res.json({ ok: true, session });
});

app.post('/orders', authRequired, async (req, res) => {
  const collection = await ordersCollection();
  const payload = req.body || {};
  const doc = {
    _id: new ObjectId(),
    id: `#${Math.floor(Math.random() * 9000) + 1000}`,
    customer: payload.customer || '',
    phone: payload.phone || '',
    city: payload.city || 'aquidauana',
    product: payload.product || '',
    quantity: Number(payload.quantity || 1),
    status: payload.status || 'Novo',
    driverId: payload.driverId || null,
    address: payload.address || '',
    location: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await collection.insertOne(doc);
  res.status(201).json({ ok: true, order: doc });
});

app.get('/orders/:id', authRequired, async (req, res) => {
  const collection = await ordersCollection();
  const order = await collection.findOne({ id: req.params.id });
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
  res.json({ ok: true, order });
});

app.patch('/orders/:id/status', authRequired, async (req, res) => {
  const status = String(req.body?.status || '').trim();
  if (!status) return res.status(400).json({ error: 'Informe o status.' });

  const collection = await ordersCollection();
  const result = await collection.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after' }
  );

  if (!result?.value) return res.status(404).json({ error: 'Pedido não encontrado.' });
  res.json({ ok: true, order: result.value });
});

app.patch('/orders/:id/assign-driver', authRequired, async (req, res) => {
  const driverId = String(req.body?.driverId || '').trim();
  const collection = await ordersCollection();
  const result = await collection.findOneAndUpdate(
    { id: req.params.id },
    { $set: { driverId: driverId || null, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after' }
  );

  if (!result?.value) return res.status(404).json({ error: 'Pedido não encontrado.' });
  res.json({ ok: true, order: result.value });
});

app.post('/drivers/location', authRequired, async (req, res) => {
  const driverId = String(req.body?.driverId || '').trim();
  const lat = Number(req.body?.lat);
  const lng = Number(req.body?.lng);
  const orderId = String(req.body?.orderId || '').trim();

  if (!driverId || Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  const drivers = await driversCollection();
  await drivers.updateOne(
    { id: driverId },
    { $set: { lastLat: lat, lastLng: lng, lastSeenAt: new Date().toISOString() } },
    { upsert: true }
  );

  const locations = await driverLocationsCollection();
  await locations.insertOne({
    driverId,
    orderId: orderId || null,
    lat,
    lng,
    createdAt: new Date().toISOString()
  });

  res.json({ ok: true });
});

app.get('/orders/:id/live', authRequired, async (req, res) => {
  const orders = await ordersCollection();
  const drivers = await driversCollection();
  const order = await orders.findOne({ id: req.params.id });
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });

  const driver = order.driverId ? await drivers.findOne({ id: order.driverId }) : null;
  res.json({ ok: true, order, driver });
});

app.get('/drivers/me/orders', authRequired, async (req, res) => {
  const driverId = String(req.query.driverId || '').trim();
  if (!driverId) return res.status(400).json({ error: 'Informe o driverId.' });

  const orders = await ordersCollection();
  const list = await orders.find({ driverId }).sort({ updatedAt: -1 }).toArray();
  res.json({ ok: true, orders: list });
});

app.use((_, res) => res.status(404).json({ error: 'Not found' }));

app.listen(port, () => {
  console.log(`Telegas API listening on ${port}`);
});

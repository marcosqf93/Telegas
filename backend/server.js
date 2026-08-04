require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const sendgridMail = require('@sendgrid/mail');
const { ObjectId } = require('mongodb');
const { getDb } = require('./db');

const app = express();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
const frontendUrl = process.env.FRONTEND_URL || '*';
const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const adminPassword = String(process.env.ADMIN_PASSWORD || '');
const sendgridApiKey = String(process.env.SENDGRID_API_KEY || '').trim();
const sendgridFromEmail = String(process.env.SENDGRID_FROM_EMAIL || '').trim();

const pairCodes = new Map();

const defaultPrices = {
  aquidauana: { p13: 138, p20: 204, p45: 495 },
  anastacio: { p13: 138, p20: 204, p45: 495 },
  miranda: { p13: 135, p20: 190, p45: 480 }
};

if (sendgridApiKey) sendgridMail.setApiKey(sendgridApiKey);

app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(cors({ origin: frontendUrl === '*' ? true : frontendUrl, credentials: true }));

function createTempCode() {
  return String(Math.floor(Math.random() * 900000) + 100000);
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

async function pricesCollection() {
  const db = await getDb();
  return db.collection('price_settings');
}

async function adminProfileCollection() {
  const db = await getDb();
  return db.collection('admin_profiles');
}

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'telegas-api' });
});

app.get('/prices', authRequired, async (_, res) => {
  const collection = await pricesCollection();
  const record = await collection.findOne({ key: 'price-matrix' });
  res.json({ ok: true, prices: record?.prices ?? defaultPrices });
});

app.get('/admin/profile', authRequired, async (req, res) => {
  const collection = await adminProfileCollection();
  const email = String(req.user?.email || '').trim().toLowerCase();
  const profile = await collection.findOne({ key: 'admin-profile', email });

  res.json({
    ok: true,
    profile: profile?.profile ?? {
      name: 'Administrador',
      email,
      phone: '',
      username: email ? email.split('@')[0] : 'admin',
      avatarUrl: ''
    }
  });
});

app.put('/admin/profile', authRequired, async (req, res) => {
  const payload = req.body?.profile || {};
  const email = String(req.user?.email || '').trim().toLowerCase();
  const profile = {
    name: String(payload.name || 'Administrador').trim(),
    email: String(payload.email || email).trim().toLowerCase(),
    phone: String(payload.phone || '').trim(),
    username: String(payload.username || email.split('@')[0] || 'admin').trim().replace(/\s+/g, ''),
    avatarUrl: String(payload.avatarUrl || '').trim()
  };

  if (!profile.email) return res.status(400).json({ error: 'Informe o e-mail.' });

  const collection = await adminProfileCollection();
  await collection.updateOne(
    { key: 'admin-profile', email },
    { $set: { key: 'admin-profile', email, profile, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );

  res.json({ ok: true, profile });
});

app.get('/drivers', authRequired, async (_, res) => {
  const collection = await driversCollection();
  const drivers = await collection.find({}).sort({ name: 1 }).toArray();
  res.json({ ok: true, drivers });
});

app.post('/drivers', authRequired, async (req, res) => {
  const payload = req.body || {};
  const collection = await driversCollection();
  const driver = {
    _id: new ObjectId(),
    id: `d-${Math.random().toString(36).slice(2, 8)}`,
    name: String(payload.name || '').trim(),
    city: String(payload.city || 'aquidauana').trim(),
    phone: String(payload.phone || '').trim(),
    active: Boolean(payload.active),
    lat: Number(payload.lat || 0),
    lng: Number(payload.lng || 0),
    lastSeenAt: new Date().toISOString()
  };

  if (!driver.name || !driver.phone) {
    return res.status(400).json({ error: 'Informe nome e telefone.' });
  }

  await collection.insertOne(driver);
  res.status(201).json({ ok: true, driver });
});

app.patch('/drivers/:id', authRequired, async (req, res) => {
  const payload = req.body || {};
  const collection = await driversCollection();
  const updates = {};

  if (payload.name != null) updates.name = String(payload.name).trim();
  if (payload.city != null) updates.city = String(payload.city).trim();
  if (payload.phone != null) updates.phone = String(payload.phone).trim();
  if (payload.active != null) updates.active = Boolean(payload.active);

  const result = await collection.findOneAndUpdate(
    { id: req.params.id },
    {
      $set: {
        ...updates,
        lastSeenAt: new Date().toISOString()
      }
    },
    { returnDocument: 'after' }
  );

  if (!result?.value) return res.status(404).json({ error: 'Entregador não encontrado.' });
  res.json({ ok: true, driver: result.value });
});

app.delete('/drivers/:id', authRequired, async (req, res) => {
  const collection = await driversCollection();
  const result = await collection.deleteOne({ id: req.params.id });
  if (!result.deletedCount) return res.status(404).json({ error: 'Entregador não encontrado.' });
  res.json({ ok: true });
});

app.put('/prices', authRequired, async (req, res) => {
  const prices = req.body?.prices;
  if (!prices || typeof prices !== 'object') {
    return res.status(400).json({ error: 'Informe os preços.' });
  }

  const collection = await pricesCollection();
  await collection.updateOne(
    { key: 'price-matrix' },
    { $set: { key: 'price-matrix', prices, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );

  res.json({ ok: true, prices });
});

function verifyAdminCredentials(email, password) {
  if (!adminEmail || !adminPassword) return false;
  return email === adminEmail && password === adminPassword;
}

async function handleAdminAuthRequest(req, res) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ error: 'Informe e-mail e senha.' });
  if (!verifyAdminCredentials(email, password)) return res.status(401).json({ error: 'Credenciais inválidas.' });
  if (!sendgridApiKey || !sendgridFromEmail) {
    return res.status(500).json({ error: 'SendGrid não configurado.' });
  }

  const code = createTempCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  pairCodes.set(email, { email, code, expiresAt });

  await sendgridMail.send({
    to: email,
    from: sendgridFromEmail,
    subject: 'Seu código de acesso Tele Gás',
    text: `Seu código de acesso é ${code}. Ele expira em 10 minutos.`,
    html: `<p>Seu código de acesso é <strong>${code}</strong>.</p><p>Ele expira em 10 minutos.</p>`
  });

  res.json({ ok: true, email, expiresAt, prompt: 'Digite o código enviado para seu email.' });
}

function handleAdminAuthConfirm(req, res) {
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
}

app.post('/admin/auth/request', async (req, res) => handleAdminAuthRequest(req, res));
app.post('/admin/auth/confirm', async (req, res) => handleAdminAuthConfirm(req, res));
app.post('/admin/pair/request', async (req, res) => handleAdminAuthRequest(req, res));
app.post('/admin/pair/confirm', async (req, res) => handleAdminAuthConfirm(req, res));

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

app.get('/orders', authRequired, async (_, res) => {
  const collection = await ordersCollection();
  const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();
  res.json({ ok: true, orders });
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

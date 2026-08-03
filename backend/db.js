const { MongoClient } = require('mongodb');

let client;
let db;

async function getDb() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');

  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}

async function closeDb() {
  if (!client) return;
  await client.close();
  client = undefined;
  db = undefined;
}

module.exports = { getDb, closeDb };

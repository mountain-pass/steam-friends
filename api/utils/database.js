const MongoClient = require('mongodb').MongoClient

async function connectToDatabase(uri, cachedDb) {
  if (cachedDb) return cachedDb
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  const db = await client.db(new URL(uri).pathname.substr(1))
  return db
}

module.exports = { connectToDatabase }

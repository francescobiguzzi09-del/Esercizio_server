const { MongoClient } = require('mongodb');
const config = require('./env');
const client = new MongoClient(config.mongoUrl);


async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
async function disconnectFromMongoDB() {
  await client.close();
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB
};
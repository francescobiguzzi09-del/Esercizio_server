const { connectToMongoDB, disconnectFromMongoDB } = require('../config/connection');
const { logger } = require('../config/logger');

exports.searchData = async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db('mydatabase');
        const collection = db.collection('mycollection');
        const query = req.body;
        const result = await collection.find(query).toArray();
        logger(`Data retrieved: ${JSON.stringify(result)}`);
    } catch (error) {
        logger(`Error occurred while searching data: ${error.message}`);
    } finally {
        await disconnectFromMongoDB();
    }
}
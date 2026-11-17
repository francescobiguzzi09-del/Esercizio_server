const { connectToMongoDB, disconnectFromMongoDB } = require('../config/connection');
const {logger} = require('../config/logger');
exports.saveData = async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db('mydatabase');
        const collection = db.collection('mycollection');
        const result = await collection.insertOne(req.body);
        logger(`Data saved with ID: ${result.insertedId}`);
    } catch (error) {
        logger(`Error occurred while saving data: ${error.message}`);
    } finally {
        await disconnectFromMongoDB();
    }
    
};
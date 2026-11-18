const { connectToMongoDB, disconnectFromMongoDB } = require('../../config/connection');
const { logger } = require('../utils/logger');
const {
    validateCollection,
    validateUser,
    validateSearchFilters
} = require('../utils/validators');
const { buildSearchQuery } = require('../utils/sanitize');

// ... exports.saveData già presente ...

exports.searchData = async (req, res) => {
    let client;

    try {
        const collectionName = validateCollection(req.params.collection);
        const userObjectId = validateUser(req.user);
        const rawFilters = validateSearchFilters(req.body);

        const query = buildSearchQuery(rawFilters, userObjectId);

        client = await connectToMongoDB();
        const db = client.db('mydatabase');
        const collection = db.collection(collectionName);

        const results = await collection.find(query).toArray();
        logger(`Found ${results.length} documents in ${collectionName}`);

        return res.status(200).json(results);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        logger(`Error occurred while searching data: ${error.message}`);

        return res.status(statusCode).json({
            error: statusCode === 500 ? 'Errore interno del server' : error.message
        });
    } finally {
        if (client) {
            await disconnectFromMongoDB();
        }
    }
};
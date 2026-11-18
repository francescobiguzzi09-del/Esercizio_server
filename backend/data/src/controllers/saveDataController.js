const { connectToMongoDB, disconnectFromMongoDB } = require('../../config/connection');
const { logger } = require('../utils/logger');
const { validateCollection, validateUser, validateBody } = require('../utils/validators');
const { buildDocument } = require('../utils/sanitize');

exports.saveData = async (req, res) => {
    let client;

    try {
        const collectionName = validateCollection(req.params.collection);
        const userObjectId = validateUser(req.user);
        const validBody = validateBody(req.body);

        const documentToSave = buildDocument(validBody, userObjectId);

        client = await connectToMongoDB();
        const db = client.db('mydatabase');
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(documentToSave);
        logger(`Data saved in ${collectionName} with ID: ${result.insertedId}`);

        return res.status(201).json({
            _id: result.insertedId,
            ...documentToSave
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        logger(`Error occurred while saving data: ${error.message}`);

        return res.status(statusCode).json({
            error: statusCode === 500 ? 'Errore interno del server' : error.message
        });
    } finally {
        if (client) {
            await disconnectFromMongoDB();
        }
    }
};
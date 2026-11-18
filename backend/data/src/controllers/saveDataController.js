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
        // Estraiamo i campi puliti inviati dal client (escludendo date e userId gestiti dal server)
        const { userId, createdAt, updatedAt, ...cleanFilters } = documentToSave;
        client = await connectToMongoDB();
        const db = client.db('mydatabase');
        const collection = db.collection(collectionName);
        // 1. VERIFICA GENERALIZZATA: cerca se esiste già un record con gli stessi dati per questo utente
        const existingDocument = await collection.findOne({
            userId: userObjectId,
            ...cleanFilters
        });
        // 2. Se esiste già, NON inserisce un duplicato
        if (existingDocument) {
            logger(`Duplicate found in ${collectionName}. Updating updatedAt.`);
            await collection.updateOne(
                { _id: existingDocument._id },
                { $set: { updatedAt: new Date() } }
            );
            return res.status(200).json({
                ...existingDocument,
                updatedAt: new Date()
            });
        }
        // 3. Se non esiste, procede con l'inserimento standard
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
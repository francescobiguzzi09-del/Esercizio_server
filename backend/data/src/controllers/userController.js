const { connectToMongoDB, disconnectFromMongoDB } = require('../../config/connection');
const { logger } = require('../utils/logger');
const { validateGoogleProfile } = require('../utils/validators');
const { buildGoogleUserUpdate } = require('../utils/sanitize');

exports.syncGoogleUser = async (req, res) => {
    let client;

    try {
        const normalizedProfile = validateGoogleProfile(req.body);
        const updateOperation = buildGoogleUserUpdate(normalizedProfile);

        client = await connectToMongoDB();
        const db = client.db('mydatabase');
        const usersCollection = db.collection('users');

        const result = await usersCollection.findOneAndUpdate(
            { googleId: normalizedProfile.googleId },
            updateOperation,
            { upsert: true, returnDocument: 'after' }
        );

        const dbUser = result?.value || result;
        logger(`Google user synced with ID: ${dbUser._id}`);

        return res.status(200).json({
            id: dbUser._id.toString(),
            email: dbUser.email,
            firstName: dbUser.firstName,
            displayName: dbUser.displayName,
            avatar: dbUser.avatar
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        logger(`Error syncing Google user: ${error.message}`);

        return res.status(statusCode).json({
            error: statusCode === 500 ? 'Errore interno del server' : error.message
        });
    } finally {
        if (client) {
            await disconnectFromMongoDB();
        }
    }
};
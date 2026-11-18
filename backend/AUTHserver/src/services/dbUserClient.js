const config = require('../../config/env');

const DB_SERVER_URL = config.DB_SERVER_URL;
const INTERNAL_API_KEY = config.INTERNAL_API_KEY;

async function syncUserWithDatabase(googleProfile) {
    const response = await fetch(`${DB_SERVER_URL}/internal/users/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-key': INTERNAL_API_KEY
        },
        body: JSON.stringify(googleProfile)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Impossibile sincronizzare l’utente con il database');
    }

    return data; // { id, email, name, avatar }
}

module.exports = { syncUserWithDatabase };
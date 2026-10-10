const fetch = require("node-fetch");
const { getWeather } = require("../utils/apiClient");
const { normalizeWeather } = require("../utils/normalizeWeather");
const { validateCity } = require("../utils/validateCity");
const { WEATHER_API_KEY } = require("../utils/conastants");
const { logError } = require("../utils/logger");

exports.weatherController = async (req, res) => {
    const city = req.body.city;

    if (!validateCity(city)) {
        return res.json({ error: true, message: "Città non valida" });
    }

    try {
        const data = await getWeather(city, WEATHER_API_KEY);

        if (data.cod !== 200) {
            return res.json({ error: true, message: "Città non trovata" });
        }

        res.json(normalizeWeather(data));
    } catch (err) {
        logError(err);
        res.json({ error: true, message: "Errore nel server" });
    }
};
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/about.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

app.get('/weather', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/weather.html'));
});


app.post('/login', (req, res) => {
    const { username, password } = req.body || {};

    if (username === 'admin' && password === 'password') {
        return res.send('credenziali corrette');
    }

    return res.send('credenziali errate');
});

app.post('/weather', async (req, res) => {
    const city = req.body.city;
    console.log(city);
    //res.send(`Hai richiesto il meteo per: ${city}`);
    /*occorre registrarsi sul sito https://openweathermap.org/ per opttenere una api key
    alla voce apikey, viene nfornito il codice di accesso per l'account, nel mio caso 446e332294950ade2b0883908d551808*/
    const apiKey = process.env.WEATHER_API;
    try {
        // Chiamata API meteo
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`
        );

        const data = await response.json();

        // Se la città non esiste
        if (data.cod != 200) {
            return res.json({
                error: true,
                message: "Città non trovata"
            });
        }

        // Risposta JSON pulita
        res.json({
            city: data.name,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            wind: data.wind.speed
        });

    } catch (err) {
        console.error(err);
        res.json({
            error: true,
            message: "Errore nel server"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body || {};

    if (username === 'admin' && password === 'password') {
        return res.send('credenziali corrette');
    }

    return res.send('credenziali errate');
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome to Mobile Point')
});

app.listen(port, () => {
    console.log("Running in port:", port);
});
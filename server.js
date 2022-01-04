'use strict';
const express = require('express');
const app = express();

const path = require('path');

app.use(express.static(path.join(__dirname, '/pub')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/demo/welcome.html'))
})

app.get('/example', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/demo/example.html'))
})

app.get('/documentation', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/demo/documentation.html'))
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
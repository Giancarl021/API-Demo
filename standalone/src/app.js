const express = require('express');
const cors = require('cors');
const routes = require('./routes');

// Create an express app
const app = express();

// Middlewares for Cross-Origin Resource Sharing (CORS) and JSON body parsing
app.use(cors());
app.use(express.json());

// Adding the routes to the app
app.use(routes);

module.exports = app;
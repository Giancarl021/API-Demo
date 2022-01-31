const express = require('express');
const Database = require('./services/database');
const UserController = require('./controllers/user');
const LicenseController = require('./controllers/license');

// Create a express router
const routes = express.Router();

// Connect with the database
const database = Database();

// Instantiate the controllers
const userController = UserController({ database });
const licenseController = LicenseController({ database });

// Routes for user management
routes.get('/user', userController.index);
routes.get('/user/:id', userController.get);
routes.post('/user', userController.create);
routes.put('/user/:id', userController.edit);
routes.delete('/user/:id', userController.remove);

// Routes for license listing
routes.get('/license', licenseController.index);

module.exports = routes;
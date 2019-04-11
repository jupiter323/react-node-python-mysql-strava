/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';

// const routeHandler = require('./../handlers/route-handler');
const userRoutes = require('../routes/auth');
const mainRoutes = require('../routes/main');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

class Routes {

	constructor(app) {
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes() {
		this.app.use('/api', mainRoutes);
		this.app.use('/api/account', userRoutes);
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	}

	routesConfig() {
		this.appRoutes();
	}
}

module.exports = Routes;
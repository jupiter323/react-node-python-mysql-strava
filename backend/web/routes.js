/*
* @author Shashank Tiwari
*/

'use strict';

// const routeHandler = require('./../handlers/route-handler');
var authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const mainRoutes = require('../routes/main');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport')

require('../middlewares/passport');
class Routes {

	constructor(app) {
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes() {
		this.app.use('/api/auth', authRoutes);
		this.app.use('/api', passport.authenticate('jwt', { session: false }), mainRoutes);
		this.app.use('/api/account',passport.authenticate('jwt', { session: false }), userRoutes);
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	}

	routesConfig() {
		this.appRoutes();
	}
}
module.exports = Routes;
/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';

// const routeHandler = require('./../handlers/route-handler');
const userRoutes = require('../routes/auth');
const mainRoutes = require('../routes/main');


class Routes{

	constructor(app){
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes(){
        this.app.use('/api',mainRoutes);
        this.app.use('/api/account', userRoutes);
	}

	routesConfig(){
		this.appRoutes();
	}
}

module.exports = Routes;
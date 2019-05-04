const express = require('express');
const http = require('http');
const appConfig = require('./config/app-config');
var path = require('path');
require('./config/make-dir');
const routes = require('./web/routes');
const cronJob = require('./web/cron')


class Server {

    constructor() {
        this.app = express();
        this.http = http.Server(this.app);       
    }

    appConfig() {
        new appConfig(this.app).includeConfig();
    }

    includeRoutes() {
        new routes(this.app).routesConfig();
        new cronJob().cronjobConfig();      
    }

    appExecute() {

        this.appConfig();
        this.includeRoutes();

        const port = process.env.PORT || 30;
        const host = process.env.HOST || `localhost`;

        this.http.listen(port, host, () => {
            console.log(`Listening on http://${host}:${port}`);
        });  
    }
 

}


global.appRoot = path.resolve(__dirname);
const app = new Server()


app.appExecute();


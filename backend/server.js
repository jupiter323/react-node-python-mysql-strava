const express = require('express');
const http = require('http');
var fs = require("fs");
// const socketio = require('socket.io');

const appConfig = require('./config/app-config');

// const socketEvents = require('./web/socket');
const routes = require('./web/routes');
// const cronJob = require('./web/cron')
var path = require('path');

class Server {

    constructor() {
        this.app = express();
        this.http = http.Server(this.app);
        // this.socket = socketio(this.http);
    }

    appConfig() {
        new appConfig(this.app).includeConfig();
    }

    includeRoutes() {
        new routes(this.app).routesConfig();
        // new cronJob().cronjobConfig();
        // new socketEvents(this.socket).socketConfig();
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

var storagefolder =[ `storage`,`storage/csv`,`storage/auth_data`, `storage/gpx`];

for (let i in storagefolder){
    if (!fs.existsSync(storagefolder[i])) {
        fs.mkdirSync(storagefolder[i]);
    }
}

const app = new Server()

app.appExecute();

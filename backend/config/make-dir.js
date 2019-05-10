var fs = require("fs");

var storagefolder = [`storage`, `storage/gpx`];

for (let i in storagefolder) {
    if (!fs.existsSync(storagefolder[i])) {
        fs.mkdirSync(storagefolder[i]);
    }
}
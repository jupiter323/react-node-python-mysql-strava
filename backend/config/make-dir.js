var fs = require("fs");

var storagefolder =[ `storage`,`storage/csv`,`storage/auth_data`, `storage/gpx`];

for (let i in storagefolder){
    if (!fs.existsSync(storagefolder[i])) {
        fs.mkdirSync(storagefolder[i]);
    }
}
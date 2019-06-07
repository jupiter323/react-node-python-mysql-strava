var fs = require("fs");

var storagefolder = [`storage`, `storage/gpx`,`storage/gpx/organizedevents`];

for (let i in storagefolder) {
    if (!fs.existsSync(storagefolder[i])) {
        fs.mkdirSync(storagefolder[i]);
    }
}

module.exports = {
    "up": "CREATE TABLE users (user_id INT NOT NULL, UNIQUE KEY user_id (user_id), name TEXT )",
    "down": "DROP TABLE users"
}
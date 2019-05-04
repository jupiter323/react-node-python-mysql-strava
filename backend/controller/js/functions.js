
'use strict';

const fs = require('fs');
const cfg = require('./config.js')
const mysql = require('mysql');

let con = null

function formatDateForSql(date) {
    // var date = new Date();
    var aaaa = date.getFullYear();
    var gg = date.getDate();
    var mm = (date.getMonth() + 1);
    if (gg < 10) gg = "0" + gg;
    if (mm < 10) mm = "0" + mm;
    var cur_day = aaaa + "-" + mm + "-" + gg;
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return cur_day + " " + hours + ":" + minutes + ":" + seconds;
}

function getQueryResult(query, callback, transdata) {
    if (con == null) {
        con = mysql.createConnection(cfg.mysql_args);
        con.connect(function (err) {
            if (err) {
                console.log('connect-error')
                callback(err, null, transdata)
                con = null
                return;
            }
            else {
                console.log("db connected for options");
                do_query()
            }
        });
    }
    else do_query()

    function do_query() {
        con.query(query, function (err, result, fields) {
            callback(err, result, transdata);
        });
    }
}

function queryPromise(query) {
    return new Promise(function (resolve, reject) {
        getQueryResult(query, (err, data) => {
            if (err) reject(err)
            else resolve(data);
        }, null);
    })
}

function random_hex(len) {
    // len digit hex random number
    var s = '';
    for (var i = 0; i < len; i++) {
        var n = Math.floor(Math.random() * 16)
        s += n.toString(16);
    }
    return s;
}

module.exports = {
    getQueryResult: getQueryResult,
    random_hex: random_hex,
    formatDateForSql: formatDateForSql,
    queryPromise: queryPromise,
}
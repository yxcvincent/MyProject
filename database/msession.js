var Settings = require('./settings');
2 var Db = require('mongodb').Db;
3 var Server = require('mongodb').Server; 
4 var db = new Db(Settings.DB, new Server(Settings.HOST, Settings.PORT, {auto_reconnect:true, native_parser: true}),{safe: false});
5 
6 module.exports = db;
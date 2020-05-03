const express = require('express');
const app = express();
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
//Sqlite connection
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./routes/private/main.db');

db.run("CREATE TABLE IF NOT EXISTS accounts(username VARCHAR, password VARCHAR, rank VARCHAR)");
db.run("CREATE TABLE IF NOT EXISTS tasks(rank VARCHAR, status INT, name VARCHAR, description VARCHAR, id VARCHAR)");
console.log("Connected to the database!");

const main = require('./routes/main');
const api = require('./routes/api');

app.enable('verbose errors');
require('events').EventEmitter.defaultMaxListeners = 0;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', main);
app.use('/api', api);

app.listen(8000, () => {
  console.log("App is running on port 8000!");
});

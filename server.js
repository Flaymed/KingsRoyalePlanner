const express = require('express');
const app = express();
const ejs = require('ejs');

//Session
const session = require('express-session');
const bodyParser = require('body-parser');
const redis = require('redis');
const redisStore = require('connect-redis')(session);

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 8000, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

const home = require('./routes/home');

app.enable('verbose errors');
require('events').EventEmitter.defaultMaxListeners = 0;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', home);

app.listen(8000, () => {
  console.log("App is running on port 8000!");
});

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./main.db');
var hash = require('object-hash');
var short = require('short-uuid');

let username = "Flaymed";
let password = "no pass for u";
let rank = "executive";

let user = [];

function getStaff() {

  db.each("SELECT * FROM accounts", (err, data) => {
    if (err) throw err;

    console.log(data);

  });
}

getStaff()

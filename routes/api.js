const express = require('express');
const router = express.Router();
var uuid = require('uuid-random');
var hash = require('object-hash');

//Sqlite connection
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./routes/private/main.db');



function setRank(username, rank) {
  db.run("UPDATE accounts SET rank=? WHERE username=?", [rank, username]);
}

function deleteUser(username) {
  db.run("DELETE FROM accounts WHERE username=?", [username]);
}

function createUser(username, password, rank) {
  let passHash = hash(password);

  db.run("INSERT INTO accounts (username, password, rank) VALUES (?, ?, ?)", [username, passHash, rank]);

}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

router.get('/', function(req, res) {
  res.send('api is up');
})


module.exports = router

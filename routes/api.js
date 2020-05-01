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

router.get('/tasks/:rank?', function(req, res) {
  let rank = req.params.rank;
  let tasks = [];

  db.each("SELECT * FROM tasks WHERE rank=?", [rank], (error, task) => {
    if (error) throw error;

    tasks.push([task.name, task.status]);
  }, () => {
    res.send(tasks);
  })

})

router.get('/tasks/create/:name?/:rank?', function(req, res) {
  let name = req.parmas.name;
  let rank = req.parmas.rank;

  db.run("INSERT INTO tasks (rank, status, name) VALUES (?, ?, ?)", [name, 0, rank]);

  res.sendStatus(1000);
})

module.exports = router

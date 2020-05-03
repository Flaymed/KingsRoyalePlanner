const express = require('express');
const router = express.Router();
var uuid = require('uuid-random');
var hash = require('object-hash');
var short = require('short-uuid');

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

    tasks.push([task.name, task.description, task.status, task.id, task.rank]);
  }, () => {
    res.send(tasks);
  })

})

router.post('/tasks/create/:rank?', function(req, res) {
  let name = req.body.task.name;
  let rank = req.params.rank;
  let desc = req.params.desc;
  let id = short.generate();

  db.run("INSERT INTO tasks (rank, status, name, description, id) VALUES (?, ?, ?, ?, ?)", [name, 0, rank, desc, id]);

  res.sendStatus(1000);
})


router.get('/staff', function(req, res) {
  let staff = [];

  db.each("SELECT * FROM accounts", (error, member) => {
    if (error) throw error;

    staff.push([member.username, member.rank])
  }, () => {
    res.send(staff);
  })

})

module.exports = router

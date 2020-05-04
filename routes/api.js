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
  let desc = req.body.task.desc;
  let id = short.generate();

  let cookie = req.cookies.verify;
  let user = [];

  if (cookie == undefined || cookie == null) {
    res.render('pages/index');
  } else {
    db.each("SELECT * FROM accounts WHERE password=?", [cookie], (error, data) => {
      if (error) throw error;

      user.push(data.username, data.rank);
    }, () => {
      if (user == '') {
        res.render('pages/index');
      }

      db.run("INSERT INTO tasks (rank, status, name, description, id) VALUES (?, ?, ?, ?, ?)", [rank, 0, name, desc, id]);

      res.render('pages/tasks', {
        rank: rank
      });

    })
  }
})

router.get('/tasks/promote/:id?/:status?', function(req, res) {
  let id = req.params.id;
  let status = req.params.status;

  if (cookie == undefined || cookie == null) {
    res.render('pages/index');
  } else {
    db.each("SELECT * FROM accounts WHERE password=?", [cookie], (error, data) => {
      if (error) throw error;

      user.push(data.username, data.rank);
    }, () => {
      if (user == '') {
        res.render('pages/index');
      }

      db.run("UPDATE tasks SET status=? WHERE id=?", [status, id]);
      res.sendStatus(200);

    })
  }


})

router.get('/tasks/delete/:id?', function(req, res) {
  let id = req.params.id;

  if (cookie == undefined || cookie == null) {
    res.render('pages/index');
  } else {
    db.each("SELECT * FROM accounts WHERE password=?", [cookie], (error, data) => {
      if (error) throw error;

      user.push(data.username, data.rank);
    }, () => {
      if (user == '') {
        res.render('pages/index');
      }

      db.run("DELETE FROM tasks WHERE id=?", [id]);
      res.sendStatus(200);

    })
  }

})


router.post('/createUser', function(req, res) {

  let username = req.body.user.name;
  let password = req.body.user.pass;
  let rank = req.body.user.rank.toLowerCase();

  if (cookie == undefined || cookie == null) {
    res.render('pages/index');
  } else {
    db.each("SELECT * FROM accounts WHERE password=?", [cookie], (error, data) => {
      if (error) throw error;

      user.push(data.username, data.rank);
    }, () => {
      if (user == '') {
        res.render('pages/index');
      }

      if (user[1].toLowerCase() !== "executive") {
        res.render('pages/index')
      }

      createUser(username, password, rank);
      res.render('pages/staff');

    })

  }

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

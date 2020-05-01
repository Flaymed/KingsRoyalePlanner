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

function sendTo(res, rank, username) {
  switch (rank.toLowerCase()) {
    case "executive":
      res.render("pages/exepanel", {
        rank: rank,
        username: username
      })

      break;

    default:
      res.render("pages/panel", {
        rank: rank,
        username: username
      })
      break;
  }
}

// use res.render to load up an ejs view file

router.get('/', function(req, res) {

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
        res.render("pages/index");
      }

      sendTo(res, user[1], user[0]);

    })
  }

});

router.post('/panel', function(req, res) {

  let username = req.body.user.name;
  let password = req.body.user.pass;

  let user = [];

  db.each("SELECT * FROM accounts WHERE username=?", [username], (err, data) => {
    if (err) throw err;

    user.push(data.username, data.password, data.rank);

  }, () => {
    if (user == '') {
      res.render("pages/index")
    } else {
      if (hash(password) == user[1]) {

        res.cookie("verify", hash(password));

        sendTo(res, user[2], user[0]);

      } else {
        res.render("pages/index");
      }
    }
  })

});

router.post('/createUser', function(req, res) {

  let username = req.body.user.name;
  let passowrd = req.body.user.pass;
  let rank = req.body.user.rank;

  createUser(username, password, rank);

  //1000 status for user complete.
  res.sendStatus(1000);

})


module.exports = router

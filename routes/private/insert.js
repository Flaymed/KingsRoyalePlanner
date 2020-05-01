var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./main.db');
var hash = require('object-hash');

let username = "Flaymed";
let password = hash("D5r8e2w5!");
let rank = "executive";

let user = [];

function getUser(username) {
  let user = [];

  db.each("SELECT * FROM accounts WHERE username=?", [username], (err, data) => {
    if (err) throw err;

    user.push(data.username, data.password, data.rank);

  }, () => {
    if (user == '') {
      console.log("code 1");
    } else {
      console.log(user[2]);
    }
  })
}

getUser("Michel");

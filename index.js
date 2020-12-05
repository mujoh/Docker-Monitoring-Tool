const express = require('express');
const app = express();
const request = require('request');
const config = require('./config/config.js');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const jwt_secret = 'g3NQ3gsC7MQYGvgp';

app.use('/', express.static('static'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({
  extended: true
})); // to support URL-encoded bodies
app.disable('x-powered-by');

let db = new sqlite3.Database("./data/user.db", (err) => {
  if (err) {
    console.log('Error when creating the database', err)
  } else {
    console.log('Database created!')
  }
})

app.use('/rest/v1/', function (request, response, next) {
  jwt.verify(request.get('JWT'), jwt_secret, function (error, decoded) {
    if (error) {
      response.status(401).send('Unauthorized access');
    } else {
      sql = "SELECT * FROM users WHERE id = ?";

      db.all(sql, [decoded.id], (err, rows) => {
        if (error) {
          throw error;
        } else {
          if (rows[0]) {
            next();
          } else {
            response.status(401).send('Credentials are wrong.');
          }
        }
      });
    }
  });
});

app.get('/me', function (req, res) {
  jwt.verify(req.get('JWT'), jwt_secret, function (error, decoded) {
    if (error) {
      console.log(error);
    } else {
      sql = "SELECT * FROM users WHERE id = ?";

      db.all(sql, [decoded.id], (err, rows) => {
        if (err) {
          throw err;
        }
        res.send(rows[0])
      });
    }
  });
});

app.get('/rest/v1/gravatar/:mail', function (req, res) {
  var profile_picture = gravatar.url(req.params.mail, {protocol: 'https', s: '200'});
  res.status(200).send(profile_picture);
});

/**CONTAINERS */

app.get("/rest/v1/containers", function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/json?all=1",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.get('/rest/v1/containers/:id/json', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/" + req.params.id + "/json",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.get('/rest/v1/containers/:id/stats', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/" + req.params.id + "/stats?stream=false",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.get('/rest/v1/containers/:id/top', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/" + req.params.id + "/top",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.get('/rest/v1/containers/:id/logs', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/" + req.params.id + "/logs",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.post('/rest/v1/containers/:id/stop', function (req, res) {
  request.post({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/" + req.params.id + "/stop",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.post('/rest/v1/containers/:id/start', function (req, res) {
  request.post({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/" + req.params.id + "/start",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.post('/rest/v1/containers/:id/restart', function (req, res) {
  request.post({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/" + req.params.id + "/restart",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.delete('/rest/v1/containers/:id/delete', function (req, res) {
  request.delete({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/" + req.params.id,
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.post('/rest/v1/containers/prune', function (req, res) {
  request.post({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/containers/prune",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

/** IMAGES */

app.get("/rest/v1/images", function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/images/json",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.delete('/rest/v1/images/:id/delete', function (req, res) {
  request.delete({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/images/" + req.params.id,
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.get('/rest/v1/images/:id/json', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/images/" + req.params.id + "/json",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.post('/rest/v1/images/prune', function (req, res) {
  request.post({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/images/prune",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

/** NETWORKS */

app.get('/rest/v1/networks', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/networks/",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.delete('/rest/v1/networks/:id/delete', function (req, res) {
  request.delete({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/networks/" + req.params.id,
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.post('/rest/v1/networks/prune', function (req, res) {
  request.post({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/networks/prune",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

/** VOLUMES */

app.get('/rest/v1/volumes', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/volumes",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.post('/rest/v1/volumes/prune', function (req, res) {
  request.post({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/volumes/prune",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

/** ABOUT DOCKER */

app.get('/rest/v1/docker/version', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/version",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.get('/rest/v1/docker/info', function (req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/info",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
});

app.post('/register', function (req, res) {
  var user = req.body;
  var date = new Date();

  bcrypt.hash(req.body.password, 10, function (err, hash) {
    user.password = hash;
    const insertData = () => {
      db.run('INSERT INTO users (name, surname, address, password, email, date) VALUES (?, ?, ?, ?, ?, ?)', [user.name, user.surname, user.address, user.password, user.email, date]);
    }

    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, surname TEXT, address TEXT, password TEXT, email TEXT, date DATE)", insertData);
    res.send({ message: "Registration successfull" });
  })
});

app.post('/login', function (req, res) {
  var user = req.body;
  console.log(user);

  sql = "SELECT * FROM users WHERE email = ?";

  db.all(sql, [user.email], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows != 0) {
      bcrypt.compare(user.password, rows[0].password, function (err, resp) {
        if (resp === true) {
          var token = jwt.sign(rows[0], jwt_secret, {
            expiresIn: 2592000
          });
          res.send({
            success: true,
            message: "Login success",
            token: token
          })
        } else {
          res.send({
            success: false,
            message: "Email and password does not match"
          })
        }
      })
    } else if (rows.length == 0) {
      res.send({
        success: false,
        message: "User does not exist"
      })
    }
  });
})

app.post('/rest/v1/activity', function(req, res) {
  var activity = req.body;
  var date = new Date();

  const insertData = () => {
    db.run('INSERT INTO activity (activity, user, date) VALUES (?, ?, ?)', [activity.activity, activity.user, date]);
  }

  db.run("CREATE TABLE IF NOT EXISTS activity (id INTEGER PRIMARY KEY AUTOINCREMENT, activity TEXT, user TEXT, date DATE)", insertData);
  res.send({ message: "Event processed" });
})

app.get('/rest/v1/activity', function(req, res) {
  sql = "SELECT * FROM activity";

  db.all(sql, (err, rows) => {
    if (err) {
      throw err;
    }

    res.send({
      success: true,
      data: rows
    })
  })
})

app.get('/rest/v1/test', function(req, res) {
  request.get({
    uri: "http://unix:" + config.docker_unix_socket_path + ":/events",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function (err, response, body) {
    if (err) console.log(err);
    res.status(200).send(body);
  });
})

app.listen(config.port || 2000, () => console.log("Example app listening on port 2000"));
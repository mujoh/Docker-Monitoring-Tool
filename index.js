const express = require('express');
const app = express();
const request = require('request');
const config = require('./config/config.js');

app.use('/', express.static('static'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({
  extended: true
})); // to support URL-encoded bodies
app.disable('x-powered-by');

app.get("/rest/v1/containers", function (req, res) {
  request.get({
    uri: "http://unix:"+config.docker_unix_socket_path+":/containers/json",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function(err, response, body) {
    if(err) console.log(err);
    res.send(body);
  });
});

app.get("/rest/v1/images", function(req, res) {
  request.get({
    uri: "http://unix:"+config.docker_unix_socket_path+":/images/json",
    headers: {
      "Content-Type": "application/json",
      "host": null
    },
    json: true
  }, function(err, response, body) {
    if(err) console.log(err);
    res.send(body);
  });
})

app.listen(config.port || 2000, () => console.log("Example app listening on port 2000"));
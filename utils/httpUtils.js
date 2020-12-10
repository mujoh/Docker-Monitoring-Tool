const axios = require('axios').default;

module.exports = {
  get: (res, url) => {
    axios.get(url, {socketPath: '/var/run/docker.sock'})
    .then(function(response) {
      return res.status(response.status).send(response.data);
    })
    .catch(function(error) {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        return res.status(error.response.status).send(error.response.statusText)
      } else if (error.request) {
        console.log(error.request);
        // client never received a response, or request never left
      } else {
        // anything else
      }
      //return res.status(error.response.status).send(error.response.statusText);
    });
  },

  post: (res, message) => {

  },

  delete: (res, message) => {

  }
}
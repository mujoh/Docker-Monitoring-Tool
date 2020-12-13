const axios = require('axios').default;

module.exports = {
  get: (res, url) => {
    axios.get(url, { socketPath: '/var/run/docker.sock' })
    .then(function(response) {
      return res.status(response.status).send(response.data);
    })
    .catch(function(error) {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        return res.status(error.response.status).send(error.response.data)
      } else if (error.request) {
        console.log(error.request);
        // client never received a response, or request never left
      } else {
        // anything else
      }
    });
  },

  post: (res, url) => {
    axios.post(url, {}, { socketPath: '/var/run/docker.sock' })
    .then(function(response) {
      return res.status(response.status).send(response.data);
    })
    .catch(function(error) {
      if (error.response) {
        return res.status(error.response.status).send(error.response.data)
      } else if (error.request) {
        console.log(error.request);
      } else {
        // anything else
      }
    })
  },

  delete: (res, url) => {
    axios.delete(url, { socketPath: '/var/run/docker.sock' })
    .then(function(response) {
      return res.status(response.status).send(response.data);
    })
    .catch(function(error) {
      if (error.response) {
        return res.status(error.response.status).send(error.response.data)
      } else if (error.request) {
        console.log(error.request);
      } else {
        // anything else
      }
    })
  }
}
const axios = require('axios').default;

module.exports = {
  get: (res, url) => {
    axios.get(url, {headers: {'Content-Type': 'application/json', 'host': null}})
    .then(function(response) {
      return res.status(response.status).send({
        success: true,
        data: response.data
      });
    })
    .catch(function(error) {
      console.log(error);
      return res.status(error.response.status).send({
        success: false,
        error: error.response.statusText
      });
    });
  },

  post: (res, message) => {

  },

  delete: (res, message) => {

  }
}
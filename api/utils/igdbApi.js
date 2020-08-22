const axios = require('axios')

const API_KEY = process.env.IGDB_USERKEY
var API = {}

// search for pc or mac game with same name...
API.searchGame = async (name) => {
  return axios({
    url: 'https://api-v3.igdb.com/games',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'user-key': API_KEY
    },
    data: `search "${name}"; fields id,name,summary,first_release_date,multiplayer_modes,platforms,popularity,rating; where platforms = (6,14); limit 1;`
  }).then((response) => response.data)
}

module.exports = API

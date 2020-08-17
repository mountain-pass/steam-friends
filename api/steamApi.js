const axios = require('axios')

const steamApiKey = process.env.STEAM_API_KEY
const BASE_URL = 'http://api.steampowered.com'

const get = (url) => axios.get(url).then((result) => result.data)

var API = {}
API.getVanityUrl = (username) =>
  get(`${BASE_URL}/ISteamUser/ResolveVanityURL/v0001/?key=${steamApiKey}&&vanityurl=${username}`)
API.getFriends = (steamId) =>
  get(`${BASE_URL}/ISteamUser/GetFriendList/v0001/?key=${steamApiKey}&steamid=${steamId}&relationship=friend`)
API.getFriendSummaries = (steamIds) =>
  get(`${BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamIds.join(',')}`)
API.getOwnedGames = (steamId) =>
  get(
    `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`
  )

// const reduce = (arr, field) => arr.reduce((map, obj) => (map[obj[field]] = obj, map), {})
// const arrSum = arr => arr.reduce((a,b) => a + b, 0)

module.exports = API

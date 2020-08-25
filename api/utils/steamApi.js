const axios = require('axios')

const steamApiKey = process.env.STEAM_API_KEY
const get = (url) => axios.get(url).then((result) => result.data)

var API = {}
API.getVanityUrl = (username) =>
  get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamApiKey}&&vanityurl=${username}`)
API.getFriends = (steamId) =>
  get(
    `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamApiKey}&steamid=${steamId}&relationship=friend`
  )
API.getFriendSummaries = (steamIds) =>
  get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamIds}`)
API.getOwnedGames = (steamId) =>
  get(
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`
  )
API.getGameData = (appid, currencyConverter = 'AU', language = 'english') =>
  get(`http://store.steampowered.com/api/appdetails/?appids=${appid}&cc=${currencyConverter}&l=${language}&v=1`)

// const reduce = (arr, field) => arr.reduce((map, obj) => (map[obj[field]] = obj, map), {})
// const arrSum = arr => arr.reduce((a,b) => a + b, 0)

module.exports = API

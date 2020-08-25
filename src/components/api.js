const axios = require('axios')

const get = (url) => axios.get(url).then((result) => result.data)

var API = {}
API.getSteamId = (username) => get(`/api/getSteamId?username=${username}`)
API.getFriends = (steamId) => get(`/api/getFriends?steamid=${steamId}`)
API.getFriendSummaries = (steamIds) => get(`/api/getFriendSummaries?sid=${steamIds.join('&sid=')}`)
API.getSharedGames = (steamIds) => get(`/api/getSharedGames?sid=${steamIds.join('&sid=')}`)
API.getGame = (appid) => axios.get('/api/getGame', { params: { appid } }).then((result) => result.data)

module.exports = API

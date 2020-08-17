const axios = require('axios')

const get = (url) => axios.get(url).then((result) => result.data)

var API = {}
API.getVanityUrl = (username) => get(`/api/getVanityUrl?username=${username}`)
API.getFriends = (steamId) => get(`/api/getFriends?steamid=${steamId}`)
API.getFriendSummaries = (steamIds) => get(`/api/getFriendSummaries?steamids=${steamIds.join(',')}`)
API.getOwnedGames = (steamId) => get(`/api/getOwnedGames?steamid=${steamId}`)

// const reduce = (arr, field) => arr.reduce((map, obj) => (map[obj[field]] = obj, map), {})
// const arrSum = arr => arr.reduce((a,b) => a + b, 0)

module.exports = API

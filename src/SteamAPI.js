const request = require('request-promise')

const get = url => {
    console.log(`GET ${url}`)
    return request({ url, json: true })
}

// var getVanityUrl = _.debounce(API.getVanityUrl, 1000);

const builder = steamApiKey => {
    
    var API = {
        getVanityUrl: username => get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamApiKey}&&vanityurl=${username}`),
        getFriends: steamId => get(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamApiKey}&steamid=${steamId}&relationship=friend`),
        getFriendSummaries: steamIds => get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamIds.join(',')}`),
        getGames: steamId => get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`)
    }
    return API
}
builder.GET_KEY_URL = 'https://steamcommunity.com/dev/apikey'

export default builder
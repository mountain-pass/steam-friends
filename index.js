const express = require('express')
const http = require('http')
const request = require('request-promise')
const path = require('path')

const get = url => {
    console.log(`GET ${url}`)
    return request({ url, json: true })
}

let { STEAM_API_KEY: steamApiKey = 'NOT_SET', PORT: port = '3000' } = process.env
port = parseInt(port)

// const BASE_URL = 'http://api.steampowered.com'
const BASE_URL = 'http://localhost:6000'

if (steamApiKey === 'NOT_SET') {
    return console.log("\nPlease pass the STEAM_API_KEY as an environment variable." +
        "If you need to get a key, please go to http://steamcommunity.com/dev/apikey\n" +
        'e.g. node express.js XXXXXXXXXXXXXXXXXX\n')
}

var API = {};
API.getVanityUrl = username => get(`${BASE_URL}/ISteamUser/ResolveVanityURL/v0001/?key=${steamApiKey}&&vanityurl=${username}`)
API.getFriends = steamId => get(`${BASE_URL}/ISteamUser/GetFriendList/v0001/?key=${steamApiKey}&steamid=${steamId}&relationship=friend`)
API.getFriendSummaries = steamIds => get(`${BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamIds.join(',')}`)
API.getOwnedGames = steamId => get(`${BASE_URL}/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`)

const reduce = (arr, field) => arr.reduce((map, obj) => (map[obj[field]] = obj, map), {})
const arrSum = arr => arr.reduce((a,b) => a + b, 0)

// playtime_forever

API.sendError = res => err => res.status(400).send(err)

/* ---- Routes ---- */

var app = express()

app.use('/static', express.static(path.join(__dirname, 'static')))

const addHeaders = res => {
    res.type('text/html')
    res.status(200)
    res.write(`<!doctype html><html lang="en"><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <link rel="stylesheet" href="/static/style.css">
    </head><body><div class="container">`)
}

const addFooter = res => {
    res.write('</div></body></html>')
    res.end()
}

app.route('/')
    .get((req, res) => {
        addHeaders(res)
        res.write(`<h1>Enter Steam username...</h1><hr/>
        <p>
        <form action="/friends" method="get" class="searchName">
        <label>Search name:</label>
        <input name="username" type="text" size="40" placeholder="Please enter your username..." autofocus/>
        <p class="subtext">Use your Steam login username or custom url. N.B. Ensure your <a href="https://steamcommunity.com/my/edit/settings">steam profile</a> visibility is "public", and you have a "Custom URL" setup.</p>
        </p>
        <p class="center"><input type="submit" value="Next - choose friends" /></p>
        </form>`)
        addFooter(res)
    })

app.route('/friends')
    .get((req, res) => {
        var username = req.query.username
        API.getVanityUrl(username).then(vanityRes => {
                var mySteamId = vanityRes.response.steamid
                console.log(`mySteamId = ${mySteamId}`)
                if (mySteamId) {
                    API.getFriends(mySteamId).then(getFriendsRes => {
                        var friendIds = getFriendsRes.friendslist.friends.map(f => f.steamid)
                        friendIds.unshift(mySteamId)
                            // get names of friends...
                        var promises = []
                        promises.push(API.getFriendSummaries(friendIds))
                        Promise.all(promises).then(responses => {
                                var friends = responses[0].response.players
                                friends = friends.sort((a, b) => a.personaname.localeCompare(b.personaname))
                                addHeaders(res)
                                res.write(`
                                <a start_again href="/">Start again</a>
                                <h1>Choose friends to search...</h1><hr/>
                                <form action="/friends/games" method="get">
                                ${friends.map(f => `
                                    <div card>
                                        <input type="checkbox" name="friendIds" value="${f.steamid}" ${f.steamid === mySteamId ? 'checked' : ''} />
                                        <div card-body>
                                            <div image><img src="${f.avatarmedium}" /></div>
                                            <div><label>Name:</label><span>${f.realname || '-'}</span></div>
                                            <div><label>Alias:</label><span>${f.personaname || '-'}</span></div>
                                            <div><label>SteamId:</label><span><a href="${f.profileurl}" target="_blank">${f.steamid || '-'}</a></span></div>
                                        </div>
                                    </div>
                                `).join('')}
                                <p class="center"><input type="submit" value="Next - see shared games" /></p>
                                </form>
                                `)
                                addFooter(res)
                            },
                            error => res.status(400).send(error))
                    })
                } else {
                    res.status(400).send('Could not find SteamId from username.')
                }
            },
            error => res.status(400).send(error))
    })


app.route('/friends/games')
    .get((req, res) => {
        const { friendIds: filteredFriendIds } = req.query
        var promises = []
        promises.push(API.getFriendSummaries(filteredFriendIds))
        filteredFriendIds.forEach(friendId => promises.push(API.getOwnedGames(friendId)))

        Promise.all(promises)
            .then(responses => {
                    const [friendSummaries, ...ownedGamesByUser] = responses

                    // map of friends...
                    const friendsBySteamId = reduce(friendSummaries.response.players, 'steamid')
                    const friends = filteredFriendIds.map((id, idx) => {
                        const friend = friendsBySteamId[id]
                        const { game_count, games } = ownedGamesByUser[idx].response
                        friend.game_count = game_count
                        friend.game_minutes = arrSum(games.map(g => g.playtime_forever))
                        friend.gamesByAppId = reduce(games, 'appid')
                        return friend
                    })

                    // map of games...
                    var gamesByAppId = {};
                    ownedGamesByUser.forEach(({response: { games }}) => {
                        games.forEach(g => {
                            let game = gamesByAppId[g.appid]
                            if (typeof game === 'undefined') {
                                game = Object.assign({}, g)
                                game.owners_count = 1
                            } else {
                                game.playtime_forever += g.playtime_forever
                                game.owners_count += 1
                            }
                            gamesByAppId[g.appid] = game
                        });
                    })
                    addHeaders(res)

                    const headers = ['Logo', 'Name', 'Friends with Game', 'Total Minutes Played']

                    // avatars
                    res.write(`
                    <a start_again href="/">Start again</a>
                    <h1>Shared games...</h1><hr/>
                    <table class="sticky_thead">
                        <thead>
                            <tr>
                                ${headers.map(x => `<th>${x}</th>`).join('')}
                                ${friends.map(f => `
                                <th>
                                    <div profile>
                                        <div image><img src="${f.avatarmedium}" /></div>
                                        <div>${f.realname || '-'}</div>
                                        <div>"${f.personaname || '-'}"</div>
                                        <div game_count>Games: ${f.game_count.toLocaleString()}</div>
                                        <div game_minutes>Total Minutes: ${f.game_minutes.toLocaleString()}</div>
                                    </div> 
                                </th>
                                `).join('')}
                            </tr>
                        </thead>
                    `)

                    // games

                    res.write(`
                    <tbody>
                    ${
                        Object.keys(gamesByAppId)
                        .map(k => gamesByAppId[k])
                        .sort((a, b) => b.owners_count - a.owners_count || b.playtime_forever - a.playtime_forever)
                        .map(game => {
                            return `
                            <tr>
                                <th><img src="http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg" /></th>
                                <th>${game.name}</th>
                                <th>${game.owners_count}</th>
                                <th game_playtime_total>${game.playtime_forever.toLocaleString()}</th>
                                ${
                                    friends.map(f => {
                                        const userGame = f.gamesByAppId[game.appid]
                                        return `<th class="${userGame ? 'green' : ''}">
                                            <div>
                                                <span user_playtime_number>${userGame ? userGame.playtime_forever.toLocaleString() : ''}</span> mins
                                            </div>
                                            <div>
                                            <span game_playtime_percent>${userGame ? Math.round(userGame.playtime_forever / game.playtime_forever * 100) + '%' : ''}</span>
                                            /
                                            <span user_playtime_percent>${userGame ? Math.round(userGame.playtime_forever / f.game_minutes * 100) + '%' : ''}</span>
                                            </div>
                                        </th>`
                                    }).join('')
                                }
                            </tr>
                        `
                    }).join('')
                    }
                    </tbody>
                    </table>
                    `)

                    addFooter(res)

                },
                error => {
                    const { message: err, stack } = error
                    console.error(`Error caught: `, { err, stack })
                    res.status(400).send(error)
                })
    })

http.createServer(app).listen(port, () => console.log(`Server started - http://127.0.0.1:3000`))

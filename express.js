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

if (steamApiKey === 'NOT_SET') {
    return console.log("\nPlease pass the STEAM_API_KEY as an environment variable." +
        "If you need to get a key, please go to http://steamcommunity.com/dev/apikey\n" +
        'e.g. node express.js XXXXXXXXXXXXXXXXXX\n')
}

var API = {};
API.getVanityUrl = username => get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamApiKey}&&vanityurl=${username}`)
API.getFriends = steamId => get(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamApiKey}&steamid=${steamId}&relationship=friend`)

API.getFriendSummaries = steamIds => get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamIds.join(',')}`)
API.getOwnedGames = steamId => get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`)

const reduce = (arr, field) => arr.reduce((map, obj) => (map[obj[field]] = obj, map), {})

// playtime_forever

API.sendError = res => err => res.status(400).send(err)

/* ---- Routes ---- */

var app = express()

app.use('/static', express.static(path.join(__dirname, 'static')))

const addHeaders = res => {
    res.type('text/html')
    res.status(200)
    res.write('<!doctype html><html lang="en"><head>')
    res.write('<meta charset="utf-8">')
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">')
    res.write('<meta name="description" content="">')
    res.write('<link rel="stylesheet" href="/static/style.css">')
    res.write('</head><body><div class="container">')
}
const addFooter = res => {
    res.write('</div></body></html>')
    res.end()
}

app.route('/')
    .get((req, res) => {
        addHeaders(res)
        res.write('<h1>Enter Steam username...</h1><hr/>')
        res.write('<p>')
        res.write('<form action="/friends" method="get">')
        res.write('<label>Steam login name/custom url:</label>&nbsp;')
        res.write('<input name="username" type="text" size="40" placeholder="Enter your Steam login name/custom url..." autofocus/>')
        res.write('<p class="subtext">N.B. Ensure your <a href="https://steamcommunity.com/my/edit/settings">steam profile</a> visibility is "public", and you have a "Custom URL" setup.</p>')
        res.write('</p>')
        res.write('<p class="center"><input type="submit" value="Next - choose friends" /></p>')
        res.write('</form>')
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
                                res.write('<h1>Choose friends to search...</h1><hr/>')
                                res.write('<form action="/friends/games" method="get">')
                                res.write('<p>')
                                res.write('<table>')
                                res.write('<thead><tr><th>' + 'Select,Avatar,SteamId,Nickname,Realname,ProfileUrl (Username)'.split(',').join('</th><th>') + '</th></tr></thead>')
                                res.write('<tbody>')
                                friends.forEach(f => {
                                    res.write('<tr>')
                                    res.write('<td><input type="checkbox" name="friendIds" value="' + f.steamid + '" ' + (f.steamid == mySteamId ? 'checked' : '') + '/>')
                                    res.write('<td>' + ['<img src="' + f.avatarmedium + '"/>', f.steamid, f.personaname, f.realname, '<a href="' + f.profileurl + '">' + f.profileurl + '</a>'].join('</td><td>') + '</td>')
                                    res.write('</tr>')
                                })
                                res.write('</tbody>')
                                res.write('</table>')
                                res.write('</p>')
                                res.write('<p class="center"><input type="submit" value="Next - see shared games" /></p>')
                                res.write('</form>')
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
        var friendIds = req.query.friendIds
        var promises = []
        promises.push(API.getFriendSummaries(friendIds))
        friendIds.forEach(friendId => promises.push(API.getOwnedGames(friendId)))

        Promise.all(promises)
            .then(responses => {
                    const [friendSummaries, ...ownedGames] = responses
                    // map of friends...
                    var friendsBySteamId = friendSummaries.response.players.reduce(function(map, p) {
                        map[p.steamid] = p;
                        return map;
                    }, {});
                    var friends = friendIds.map(id => friendsBySteamId[id])
                        // map of games...
                    var gamesByFriendId = {}
                    var gamesByAppId = {};
                    var totalMinutesByAppId = {};
                    var gameOwnersByAppId = {};
                    ownedGames.forEach(({response: { game_count, games }}, idx) => {
                        if (typeof games === 'undefined') {
                            console.error(`games was undefined at index ${idx}`)
                        } else {
                            var steamid = friendIds[idx];
                            gamesByFriendId[steamid] = reduce(games, 'appid')
                            games.forEach(g => {
                                const { playtime_forever: playtimeForeverInMinutes } = g
                                gamesByAppId[g.appid] = g;
                                totalMinutesByAppId[g.appid] = (totalMinutesByAppId[g.appid] || 0) + playtimeForeverInMinutes
                                var owners = gameOwnersByAppId[g.appid];
                                if (typeof owners === 'undefined') {
                                    owners = gameOwnersByAppId[g.appid] = []
                                }
                                owners.push(steamid)
                            });
                        }
                    })
                    addHeaders(res)

                    const headers = ['Logo', 'Name', 'Count', 'Total Minutes Played']

                    res.write('<h1>Shared games...</h1><hr/>')
                    res.write('<table class="sticky_thead">')
                    res.write('<thead>')

                    // avatars
                    res.write(`<tr>${headers.map(x => '<th></th>').join('')}<th>Avatar:</th><th>`)
                    res.write(friends.map(f => '<img src="' + f.avatarmedium + '"></img>').join('</th><th>'));
                    res.write('</th></tr>');

                    // nicknames
                    res.write(`<tr>${headers.map(x => '<th></th>').join('')}<th>Nickname:</th><th>`)
                    res.write(friends.map(f => '<a href="' + f.profileurl + '">' + f.personaname + '</a>').join('</th><th>'))
                    res.write('</th></tr>');

                    // realnames
                    res.write(`<tr>${headers.map(x => `<th></th>`).join('')}<th>Realname:</th><th>`)
                    res.write(friends.map(f => '<a href="' + f.profileurl + '">' + f.realname + '</a>').join('</th><th>'))
                    res.write('</th></tr>');

                    // game headers
                    res.write(`<tr>${headers.map(x => `<th>${x}</th>`).join('')}<th></th><th></th><th></th></tr>`)

                    res.write('</thead><tbody>')

                    const countFn = appid => {
                        var owners = gameOwnersByAppId[appid];
                        return friendIds.filter(id => owners.indexOf(id) !== -1).length
                    }

                    // games
                    Object.keys(gamesByAppId).sort((a, b) => {
                        return countFn(b) - countFn(a) || totalMinutesByAppId[b] - totalMinutesByAppId[a]
                    }).forEach(appid => {
                        var game = gamesByAppId[appid];
                        var owners = gameOwnersByAppId[appid];
                        res.write('<tr>')
                        res.write('<th><img title="' + game.name + '" src="http://media.steampowered.com/steamcommunity/public/images/apps/' + appid + '/' + game.img_logo_url + '.jpg"></img></th>');
                        res.write('<th>' + game.name + '</th>');
                        res.write('<th>' + countFn(appid) + '</th>');
                        res.write('<th>' + totalMinutesByAppId[appid] + '</th>');
                        res.write('<th class="blue"></th>')
                        // res.write(`<th>`);
                        // and whether the user is an owner...
                        const renderUserCell = (friendId, gameId) => {
                            const game = gamesByFriendId[friendId][gameId]
                            return `<th class="${(owners.indexOf(friendId) !== -1 ? 'green' : '')}">` + (game ? game.playtime_forever : '') + `</th>`
                        }
                        res.write(friendIds.map(friendId => renderUserCell(friendId, appid)).join(''));
                        res.write('</tr>');
                    });
                    res.write('</tbody></table>');

                    addFooter(res)

                },
                error => {
                    const { message: err, stack } = error
                    console.error(`Error caught: `, { err, stack })
                    res.status(400).send(error)
                })
    })

http.createServer(app).listen(port, () => console.log(`Server started - http://127.0.0.1:3000`))

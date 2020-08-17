const API = require('./steamApi')

module.exports = (req, res) => API.getOwnedGames(req.query.steamId).then((data) => res.json(data))

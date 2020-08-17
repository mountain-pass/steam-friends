const API = require('./steamApi')

module.exports = (req, res) => API.getOwnedGames(req.query.steamid).then((data) => res.json(data))

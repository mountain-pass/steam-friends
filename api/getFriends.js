const API = require('./steamApi')

module.exports = (req, res) => API.getFriends(req.query.steamId).then((data) => res.json(data))

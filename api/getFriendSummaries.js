const API = require('./steamApi')

module.exports = (req, res) => API.getFriendSummaries(req.query.steamIds).then((data) => res.json(data))

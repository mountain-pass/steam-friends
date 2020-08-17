const API = require('./steamApi')

module.exports = (req, res) =>
  API.getFriendSummaries(req.query.steamids).then((data) => res.json(data.response.players))

const API = require('./steamApi')

module.exports = (req, res) => API.getVanityUrl(req.query.username).then((data) => res.json(data))

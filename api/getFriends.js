const API = require('./steamApi')

module.exports = (req, res) => API.getFriends(req.query.steamid).then((data) => res.json(data.friendslist.friends))

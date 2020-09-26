const API = require('./utils/steamApi')

module.exports = (req, res) =>
  API.getFriends(req.query.steamid)
    .then((data) => API.getFriendSummaries([...data.friendslist.friends.map((f) => f.steamid), req.query.steamid]))
    .then((data) => res.json(data.response.players))
    .catch((err) => res.status(400).json({ message: err.message }))

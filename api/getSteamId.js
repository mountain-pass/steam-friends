const API = require('./utils/steamApi')

module.exports = (req, res) =>
  API.getVanityUrl(req.query.username)
    .then((result) => {
      const { response: { success = -1, steamid } = {} } = result
      if (success === 1) return res.json(steamid)
      else return res.status(404).json({ message: 'No such user.' })
    })
    .catch((err) => res.status(400).json({ message: err.message }))

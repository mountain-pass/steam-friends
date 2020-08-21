const API = require('./utils/steamApi')

module.exports = (req, res) => {
  let { query: { sid = [] } = {} } = req
  if (typeof sid === 'string') sid = [sid]
  if (sid.length === 0) return res.status(400).json({ message: "No sid's provided." })

  // array to map...
  API.getFriendSummaries(sid)
    .then((data) => {
      return res.json(
        data.response.players.reduce((pre, cur) => {
          pre[cur.steamid] = cur
          return pre
        }, {})
      )
    })
    .catch((err) => res.status(400).json({ message: err.message }))
}

const { connectToDatabase } = require('./utils/database')
const API = require('./utils/igdbApi')

let cacheDb = null
// db.users.createIndex({ appid: 1 }, { unique: true })

module.exports = async (req, res) => {
  try {
    const { query: { steamappId = null, steamName = null } = {} } = req
    if (steamappId === null || steamName === null) {
      return res.status(400).json({ message: 'Missing required params - steamappId / steamName' })
    }
    cacheDb = await connectToDatabase(process.env.MONGO_URL, cacheDb)
    const games = cacheDb.collection('games')
    const game = await games.findOne({ steamappId })
    if (game === null) {
      // retrieve game data...
      const results = await API.searchGame(steamName)
      if (results.length > 0) {
        const { id: igdbId, first_release_date: releaseDate, name, platforms, rating, summary } = results[0]
        const data = { steamappId, steamName, igdbId, releaseDate, name, platforms, rating, summary }
        await games.insertOne(data)
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
        res.json(data)
      } else {
        res.status(404).json({ message: 'No game data found.' })
      }
      // go pull game into db...
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
      res.json(game)
    }
  } catch (err) {
    console.error(`Error: ${err.message}`, { stack: err.stack })
    res.status(500).json({ message: err.message })
  }
}

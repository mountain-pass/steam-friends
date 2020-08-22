const { connectToDatabase } = require('./utils/database')
const API = require('./utils/igdbApi')

let cacheDb = null
// db.users.createIndex({ appid: 1 }, { unique: true })

module.exports = async (req, res) => {
  try {
    const { query: { steamappId = null, steamName = null } = {} } = req
    // validate id...
    if (typeof steamappId !== 'string' || steamappId.trim().length === 0) {
      return res.status(400).json({ message: 'Missing required params - steamappId' })
    }

    // prepare db, retrieve game...
    cacheDb = await connectToDatabase(process.env.MONGO_URL, cacheDb)
    const games = cacheDb.collection('games')
    const game = await games.findOne(
      { steamappId },
      { projection: { _id: 0, steamappId: 0, steamName: 0, igdbId: 0, summary: 0 } }
    )

    // if game doesn't exist...
    if (game === null) {
      // validate name...
      if (typeof steamName !== 'string' || steamName.trim().length === 0) {
        return res.status(400).json({ message: 'Missing required params - steamName' })
      }
      // retrieve game data...
      const results = await API.searchGame(steamName)
      if (results.length > 0) {
        const { id: igdbId, first_release_date: releaseDate, ...fields } = results[0]
        const data = { steamappId, steamName, igdbId, releaseDate, ...fields }
        await games.insertOne(data)
        res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
        res.json(data)
      } else {
        const data = { steamappId, steamName, nomatch: true }
        await games.insertOne(data)
        res.json(data)
      }
      // go pull game into db...
    } else {
      if (game.nomatch !== true) {
        res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
      }
      res.json(game)
    }
  } catch (err) {
    console.error(`Error: ${err.message}`, { stack: err.stack })
    res.status(500).json({ message: err.message })
  }
}

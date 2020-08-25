const { connectToDatabase } = require('./utils/database')
const API = require('./utils/steamApi')
const { ReplSet } = require('mongodb')

let cacheDb = null
// db.users.createIndex({ appid: 1 }, { unique: true })

const filterSteamGameData = (steamGameData) => {
  const {
    is_free: isFree,
    price_overview: { currency, final: finalPriceCents } = {},
    platforms: { windows: win, linux: lin, mac } = {},
    metacritic: { score: rating } = {},
    categories = [],
    release_date: { date: releaseDate } = {}
  } = steamGameData
  let single = false
  let multi = false
  categories.forEach((x) => {
    if (x.id === 1) multi = true
    else if (x.id === 2) single = true
  })
  const priceAudCents = isFree ? 0 : currency === 'AUD' ? finalPriceCents : undefined
  let releaseYear = releaseDate.match(/\d{4}/)
  releaseYear = releaseYear === null ? undefined : parseInt(releaseYear)
  return {
    modes: { single, multi },
    priceAudCents,
    platforms: { win, lin, mac },
    rating,
    releaseYear
  }
}

module.exports = async (req, res) => {
  try {
    const { query: { appid = null } = {} } = req
    // validate id...
    if (typeof appid !== 'string' || appid.trim().length === 0) {
      return res.status(400).json({ message: 'Missing required params - steamappid' })
    }

    // prepare db, retrieve game...
    cacheDb = await connectToDatabase(process.env.MONGO_URL, cacheDb)
    const games = cacheDb.collection('games')
    const game = await games.findOne(
      { appid },
      {
        projection: {
          _id: 0,
          'steamGameData.is_free': 1,
          'steamGameData.price_overview': 1,
          'steamGameData.platforms': 1,
          'steamGameData.metacritic': 1,
          'steamGameData.categories': 1,
          'steamGameData.release_date': 1
        }
      }
    )

    // if game doesn't exist...
    if (game === null) {
      // retrieve game data...
      try {
        const result = await API.getGameData(appid)
        const { [appid]: { success = false, data: steamGameData = null } = {} } = result
        if (success) {
          await games.insertOne({ appid, steamGameData, steamRefreshedDate: new Date() })
          res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
          res.json(filterSteamGameData(steamGameData))
        } else {
          res.status(404)
          res.json({ message: 'Steam data not available.', appid })
        }
      } catch (err) {
        res.status(502)
        res.json({ message: 'Steam data not available.', appid, error: err.message })
      }
    } else {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
      res.json(filterSteamGameData(game.steamGameData))
    }
  } catch (err) {
    console.error(`Error: ${err.message}`, { stack: err.stack })
    res.status(500).json({ message: err.message })
  }
}

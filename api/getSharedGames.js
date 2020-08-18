const API = require('./steamApi')

module.exports = async (req, res) => {
  try {
    const { query: { sid: steamIds = [] } = {} } = req

    // retrieve all games
    let users = await Promise.all(
      steamIds.map((sid) => API.getOwnedGames(sid).then((data) => ({ ...data.response, sid })))
    )

    // build list of all games...
    const aggrGames = {}
    users.forEach((user) => {
      user.playtime = 0
      user.games = (user.games || []).reduce((pre, cur) => {
        // populate aggregate...
        const { appid, name, img_icon_url: icon, img_logo_url: logo, playtime_forever: playtime } = cur
        const aggr = aggrGames[appid] || (aggrGames[appid] = { name, icon, logo, owners: 0, playtime: 0 })
        aggr.owners++
        aggr.playtime += playtime
        user.playtime += playtime
        // array to map...
        pre[cur.appid] = { playtime }
        return pre
      }, {})
    })
    //  array to map...
    users = users.reduce((pre, cur) => {
      pre[cur.sid] = cur
      return pre
    }, {})

    res.json({ games: aggrGames, users })
    // res.json({ games: { 10: { name: 'Counter-Strike', icon: '6b0312cda02f5f777efa2f3318c307ff9acafbb5', logo: 'af890f848dd606ac2fd4415de3c3f5e7a66fcb9f', owners: 2, playtime: 105 }, 80: { name: 'Counter-Strike: Condition Zero', icon: '077b050ef3e89cd84e2c5a575d78d53b54058236', logo: 'acdb28ba1b4c2fcc526332c1b63fc0f7533f087f', owners: 2, playtime: 0 }, 100: { name: 'Counter-Strike: Condition Zero Deleted Scenes', icon: '077b050ef3e89cd84e2c5a575d78d53b54058236', logo: 'acdb28ba1b4c2fcc526332c1b63fc0f7533f087f', owners: 2, playtime: 0 }, 240: { name: 'Counter-Strike: Source', icon: '9052fa60c496a1c03383b27687ec50f4bf0f0e10', logo: 'ee97d0dbf3e5d5d59e69dc20b98ed9dc8cad5283', owners: 2, playtime: 3068 }, 730: { name: 'Counter-Strike: Global Offensive', icon: '69f7ebe2735c366c65c0b33dae00e12dc40edbe4', logo: 'd0595ff02f5c79fd19b06f4d6165c3fda2372820', owners: 2, playtime: 6054 }, 1250: { name: 'Killing Floor', icon: 'd8a2d777cb4c59cf06aa244166db232336520547', logo: '354c07a75cc16f6bf551b81d27f4eee3436fc2fb', owners: 1, playtime: 152 }, 35420: { name: 'Killing Floor Mod: Defence Alliance 2', icon: 'ae7580a60cf77b754c723c72d5e31d530fbe7804', logo: '45178d4b1999cf466fdf1ee4551f29b7e02b2bdf', owners: 1, playtime: 0 }, 48000: { name: 'LIMBO', icon: '463f57855017564301b17050fba73804b3bd86d6', logo: '9f35c3d64649a5a03b69d6a9218b1f77caf15025', owners: 1, playtime: 85 }, 65930: { name: 'The Bureau: XCOM Declassified', icon: '854f133d072a65e5577c2a21bf25ba863e4a6a23', logo: '52da3125ac55d5d1406c610f7e8c78755f0752ff', owners: 1, playtime: 0 }, 105600: { name: 'Terraria', icon: '858961e95fbf869f136e1770d586e0caefd4cfac', logo: '783399da7d865b7b5b1560891b1e9463345e8fa9', owners: 1, playtime: 2590 }, 210770: { name: 'Sanctum 2', icon: '4cdfa1d19be460374a111b718ce3a204f21ea1dc', logo: '333a8c65480bb85148bb3a185843a8520ae5d90f', owners: 1, playtime: 0 }, 218620: { name: 'PAYDAY 2', icon: 'a6abc0d0c1e79c0b5b0f5c8ab81ce9076a542414', logo: '4467a70648f49a6b309b41b81b4531f9a20ed99d', owners: 1, playtime: 0 }, 227940: { name: 'Heroes & Generals', icon: '64f09c15e558464a40ced00a9ef35ed13542e144', logo: 'd8dd60a0e3634e57222b1f8014d3f043deeeec35', owners: 1, playtime: 5 }, 233130: { name: 'Shadow Warrior', icon: '5d7c205ce18f17a99c95ff81499c2f496e0570f2', logo: '30d29d6ec47f0b586349106f8265e69ee091ce95', owners: 1, playtime: 1 }, 233840: { name: 'Worms Clan Wars', icon: 'aa3156dab00553132dea849e9cc836e645083f6f', logo: 'fac25fef811857959ec28393592366b31f971966', owners: 1, playtime: 22 }, 238960: { name: 'Path of Exile', icon: '1110764aac57ac28d7ffd8c43071c75d5482a9c9', logo: '7b9557d7e0d807f7dd19f2d052538fc7bff2d9b6', owners: 2, playtime: 817 }, 252490: { name: 'Rust', icon: '820be4782639f9c4b64fa3ca7e6c26a95ae4fd1c', logo: 'ced8982cc46ce2b31cdb746f0abf61e9e8935913', owners: 1, playtime: 422 }, 252950: { name: 'Rocket League', icon: '9ad6dd3d173523354385955b5fb2af87639c4163', logo: '3854e40582bc14b8ba3c9ee163a0fa64bc538def', owners: 2, playtime: 1336 }, 255520: { name: 'Viscera Cleanup Detail: Shadow Warrior', icon: '56c3840d52a0da4f397d9991d368c75ed53d99fa', logo: '09a86e49413f57dc99f2e7f54b029868ffb5cbc8', owners: 1, playtime: 0 }, 268870: { name: 'Satellite Reign', icon: 'b609806b16b6581548c7d2908f0f75936ea86f48', logo: 'ab0b0cb4aa329c420417988cc0a23f1e4663f820', owners: 1, playtime: 0 }, 285160: { name: 'LEGO® The Hobbit™', icon: 'b36006499181631396618d8c32dad8c13c6263ae', logo: '4e0add73085939dff818bdc506437560feacfd91', owners: 1, playtime: 0 }, 291550: { name: 'Brawlhalla', icon: 'c43fac31b8bf8821764603a14d09412bc3d45f66', logo: '3859e079750d8ecdcdc31e6c4ef6fc87a8098c42', owners: 1, playtime: 93 }, 308600: { name: 'Geneshift', icon: 'ad5a53a4d002455f24a246515e0580b1aae4f691', logo: 'ff1f34ac4d6c7a8176f3a77586f46c6b9dad96c4', owners: 1, playtime: 0 }, 346900: { name: 'AdVenture Capitalist', icon: 'b4dd5ca1582ed52335b31960e05766fd22fa7cc4', logo: 'ba7cd9eb5fe1905f7b5d25835d063437dec7f675', owners: 1, playtime: 68 }, 536930: { name: 'MOBIUS FINAL FANTASY', icon: 'fad8a8e16ab41a95bc64f3732c82f371768d3b82', logo: '04fce3f37a331d7f6faa40a43135909e0ce0ba78', owners: 1, playtime: 22 }, 555000: { name: 'GOAT OF DUTY', icon: 'db089f15dc9d6efaa71611985c9826641acc2170', logo: '6f03b7fdf4de5f2d528a34a12db2ac96e447f55c', owners: 1, playtime: 30 }, 582660: { name: 'Black Desert Online', icon: 'eac8a7001f56a29059d4573cdcc17bc00bd42e4d', logo: 'a7f54447b3622629240e60432ebca2fb4ff2c1e6', owners: 1, playtime: 0 }, 640590: { name: 'The LEGO® NINJAGO® Movie Video Game', icon: 'e73b26c11ea3dd22910565c0621a3f511ea943d3', logo: 'c52aacb20fbd36d9f44d6c808bce6ed795854e46', owners: 2, playtime: 1138 }, 700580: { name: 'Rust - Staging Branch', icon: '820be4782639f9c4b64fa3ca7e6c26a95ae4fd1c', logo: 'd83228eaef6c95c244976b6dc6ab357e6c7f0911', owners: 1, playtime: 0 } }, users: { '76561198355054466': { game_count: 7, games: { 240: { playtime: 980 }, 105600: { playtime: 2590 }, 218620: { playtime: 0 }, 238960: { playtime: 801 }, 252950: { playtime: 876 }, 346900: { playtime: 68 }, 640590: { playtime: 1138 } }, sid: '76561198355054466', playtime: 6453 }, '76561198810682607': { game_count: 5, games: { 10: { playtime: 0 }, 80: { playtime: 0 }, 100: { playtime: 0 }, 730: { playtime: 2271 }, 268870: { playtime: 0 } }, sid: '76561198810682607', playtime: 2271 }, '76561198085733667': { game_count: 25, games: { 10: { playtime: 105 }, 80: { playtime: 0 }, 100: { playtime: 0 }, 240: { playtime: 2088 }, 730: { playtime: 3783 }, 1250: { playtime: 152 }, 35420: { playtime: 0 }, 48000: { playtime: 85 }, 65930: { playtime: 0 }, 210770: { playtime: 0 }, 227940: { playtime: 5 }, 233130: { playtime: 1 }, 233840: { playtime: 22 }, 238960: { playtime: 16 }, 252490: { playtime: 422 }, 252950: { playtime: 460 }, 255520: { playtime: 0 }, 285160: { playtime: 0 }, 291550: { playtime: 93 }, 308600: { playtime: 0 }, 536930: { playtime: 22 }, 555000: { playtime: 30 }, 582660: { playtime: 0 }, 640590: { playtime: 0 }, 700580: { playtime: 0 } }, sid: '76561198085733667', playtime: 7284 } } })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

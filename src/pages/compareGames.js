import React from 'react'
import { Badge, Container, Table, Button } from 'react-bootstrap'
import usePromise from 'react-use-promise'
import API from '../components/api'
import { Input } from '../components/Form'
import { FriendIcon, showName } from '../components/Friend'
import { PLATFORM_ICONS } from '../components/igdb-staticdata'
import Layout from '../components/layout'
import withLocationQueryParams from '../components/withLocationQueryParams'
import { navigate } from '@reach/router'
import { Link } from 'gatsby'

const navBack = () => navigate(-1)

export default withLocationQueryParams(function Home(props) {
  const [filterName, setFilterName] = React.useState('')
  const [filterOwners, setFilterOwners] = React.useState('')
  const [filterNameRegex, setFilterNameRegex] = React.useState(null)
  const [filterOwnersRegex, setFilterOwnersRegex] = React.useState(null)
  const [steamIds, setSteamIds] = React.useState([])
  const [gameInfo, setGameInfo] = React.useState({})
  const [maxplaytime, setMaxplaytime] = React.useState(1)

  const setFilterNameValue = (str) => {
    setFilterName(str)
    setFilterNameRegex(new RegExp(str, 'i'))
  }

  const setFilterOwnersValue = (str) => {
    str = str.replace(/[^\d]/, '')
    setFilterOwners(str)
    setFilterOwnersRegex(str.length === 0 ? null : parseInt(str))
  }

  // eslint-disable-next-line
  React.useEffect(() => {
    let { search: { sid = [] } = {} } = props
    if (typeof sid === 'string') sid = [sid]
    if (Array.isArray(sid) && sid.length > 0) setSteamIds(sid)
  }, [props.search])

  // eslint-disable-next-line
  const [gamesResponse, gamesError, gamesState] = usePromise(() => {
    if (steamIds.length > 0) return API.getSharedGames(steamIds)
    return Promise.resolve(null)
  }, [steamIds])

  // eslint-disable-next-line
  const [friendsById, friendsError, friendsState] = usePromise(() => {
    console.debug('steamIds', steamIds)
    if (steamIds.length > 0) return API.getFriendSummaries(steamIds)
    return Promise.resolve({})
  }, [steamIds])

  const { games, users } = gamesResponse || {}

  // watch games list, if populated, retrieve game info...
  React.useEffect(() => {
    if (typeof games !== 'undefined' && games !== null) {
      const entries = Object.entries(games)
      console.debug(`retrieving game data - ${entries.length}`)
      let tmpmaxplaytime = 0
      entries.forEach(([appid, game]) => {
        // find largest playtime...
        tmpmaxplaytime = Math.max(tmpmaxplaytime, game.playtime)
        // iteratively update game info as new data arrives...
        API.getGame(appid, game.name).then((data) => {
          setGameInfo((ps) => ({ ...ps, [appid]: data }))
        })
      })
      setMaxplaytime(tmpmaxplaytime)
    }
  }, [games])

  return (
    <Layout title="Compare Games">
      <Container fluid>
        <Button as={Link} to="/" className="mb-3" onClick={navBack}>
          Go Back
        </Button>
        <h1>Compare Games</h1>
        <Table className="bg-white mt-3" responsive>
          <colgroup>
            <col style={{ width: '48px' }}></col>
            <col style={{ width: '25%', maxWidth: '1px' }}></col>
            <col style={{ width: '50px' }}></col>
            <col style={{ width: '50px' }}></col>
            <col style={{ width: '50px' }}></col>
            <col style={{ width: '50px' }}></col>
            <col style={{ width: '50px' }}></col>
            <col style={{ width: '50px' }}></col>
            <col style={{ width: '50px' }}></col>
          </colgroup>
          {/* table headers */}
          <thead>
            {/* filters */}
            <tr>
              <th />
              <th>
                <Input
                  nomargin
                  value={filterName}
                  onChange={(e) => setFilterNameValue(e.target.value)}
                  placeholder="Name..."
                />
              </th>
              <th colSpan="4" />
              <th>
                <Input
                  nomargin
                  value={filterOwners}
                  onChange={(e) => setFilterOwnersValue(e.target.value)}
                  placeholder="Owners..."
                />
              </th>
              <th />
              {steamIds.map((steamId) => {
                const { [steamId]: friend = null } = friendsById || {}
                const { [steamId]: userData = { playtime: 0, game_count: 0 } } = users || {}
                // friends header data...
                return (
                  <th key={steamId + 'a'}>
                    {friendsState !== 'resolved' || gamesState !== 'resolved' ? (
                      'Loading...'
                    ) : (
                      <div className="d-flex flex-row">
                        <FriendIcon friend={friend} />
                        <div className="d-flex flex-column flex-grow-1">
                          <Badge variant="info" className="mb-1">
                            Games: {userData.game_count}
                          </Badge>
                          <Badge variant="success">Playtime: {userData.playtime.toLocaleString()}</Badge>
                        </div>
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
            {/* titles */}
            <tr>
              {'Logo,Name,Popularity,Rating,Released,Platforms,# of Owners,Playtime (Mins)'.split(',').map((title) => (
                <th key={title}>{title}</th>
              ))}
              {steamIds.map((steamId) => {
                const { [steamId]: friend = {} } = friendsById || {}
                return (
                  <th key={steamId + 'b'}>
                    {friendsState === 'pending' || !friend ? (
                      'Loading...'
                    ) : friendsState === 'rejected' ? (
                      'An error occurred.'
                    ) : friendsState === 'resolved' && friend ? (
                      <>{showName(friend)}</>
                    ) : null}
                  </th>
                )
              })}
            </tr>
          </thead>
          {/* table body */}
          <tbody>
            {gamesState === 'pending' ? (
              <tr>
                <td>Loading...</td>
              </tr>
            ) : gamesState === 'rejected' || !games ? (
              <tr>
                <td>An error occurred.</td>
              </tr>
            ) : gamesState === 'resolved' && games ? (
              Object.entries(games)
                .filter(
                  ([appid, game]) =>
                    (filterNameRegex === null || game.name.match(filterNameRegex)) &&
                    (filterOwnersRegex === null || game.owners === filterOwnersRegex)
                )
                .sort((a, b) => b[1].owners - a[1].owners || b[1].playtime - a[1].playtime)
                .map(([appid, game]) => {
                  let {
                    releaseDate = null,
                    // name = '',
                    // multiplayer_modes = [],
                    platforms = [],
                    popularity = null,
                    rating = null
                  } = gameInfo[appid] || {}
                  releaseDate = releaseDate !== null ? new Date(releaseDate * 1000) : null

                  return (
                    <tr key={appid}>
                      {/* Logo */}
                      <td className="p-2 align-middle">
                        <img
                          src={`http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${game.icon}.jpg`}
                        />
                      </td>
                      {/* Name */}
                      <td className="p-2 align-middle text-truncate">
                        <a
                          className="text-truncate"
                          href={`https://store.steampowered.com/app/${appid}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {game.name}
                        </a>
                      </td>
                      <td>
                        {popularity !== null && (
                          <Badge variant={popularity >= 15 ? 'success' : ''}>{popularity.toFixed(0)}%</Badge>
                        )}
                      </td>
                      <td>
                        {rating !== null && <Badge variant={rating >= 75 ? 'success' : ''}>{rating.toFixed(0)}%</Badge>}
                      </td>
                      <td>
                        {releaseDate !== null && (
                          <Badge variant={releaseDate.getFullYear() > 2015 ? 'success' : ''}>
                            {releaseDate.getFullYear()}
                          </Badge>
                        )}
                      </td>
                      <td>{platforms.map((x) => PLATFORM_ICONS[x])}</td>
                      {/* <td>{multiplayer_modes.join(', ')}</td> */}
                      <td className="p-2 align-middle">{game.owners}</td>
                      <td className="p-2 align-middle">{game.playtime.toLocaleString()}</td>
                      {steamIds.map((steamId) => {
                        const { [steamId]: { games: { [appid]: ownedGame = null } = {} } = {} } = users || {}
                        const hasGame = ownedGame !== null
                        const playtime = hasGame ? ownedGame.playtime : 0
                        const playtimePercentage = playtime > 0 ? parseInt((playtime / maxplaytime) * 100) : null
                        return (
                          <td
                            key={steamId + appid}
                            className={`font-weight-bold ${hasGame && playtime === 0 ? 'transparent' : ''}`}
                            style={{
                              background: hasGame
                                ? playtime === 0
                                  ? '#b4e0bd'
                                  : `linear-gradient(to right, var(--success) ${playtimePercentage}%, #b4e0bd ${playtimePercentage}%)`
                                : 'transparent'
                            }}
                          >
                            {hasGame && (
                              <>
                                {playtime.toLocaleString()} <small>mins</small>
                              </>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
            ) : null}
          </tbody>
        </Table>
      </Container>
    </Layout>
  )
})

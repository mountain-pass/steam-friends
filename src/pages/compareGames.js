import React from 'react'
import { Badge, Container, Table, Button } from 'react-bootstrap'
import usePromise from 'react-use-promise'
import API from '../components/api'
import { Input } from '../components/Form'
import { FriendIcon, showName } from '../components/Friend'
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
            <col style={{ width: '150px' }}></col>
            <col style={{ width: '150px' }}></col>
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
              {'Logo,Name,Owners,Playtime (Mins)'.split(',').map((title) => (
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
                .map(([appid, game]) => (
                  <tr key={appid}>
                    <td className="p-2 align-middle">
                      <img
                        src={`http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${game.icon}.jpg`}
                      />
                    </td>
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
                    <td className="p-2 align-middle">{game.owners}</td>
                    <td className="p-2 align-middle">{game.playtime.toLocaleString()}</td>
                    {steamIds.map((steamId) => {
                      const { [steamId]: { games: { [appid]: hasGame = null } = {} } = {} } = users || {}
                      return (
                        <td
                          key={steamId + appid}
                          className={
                            hasGame !== null ? (hasGame.playtime === 0 ? 'bg-success transparent' : 'bg-success') : ''
                          }
                        >
                          {hasGame !== null ? (
                            <b>
                              {(hasGame.playtime || 0).toLocaleString()} <small>mins</small>
                            </b>
                          ) : (
                            ''
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
            ) : null}
          </tbody>
        </Table>
      </Container>
    </Layout>
  )
})

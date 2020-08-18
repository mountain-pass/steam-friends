import React from 'react'
import { Container, ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import usePromise from 'react-use-promise'
import API from '../components/api'
import { Input } from '../components/Form'
import { FriendsList } from '../components/Friend'
import useDebounce from '../components/useDebounce'
import styled from 'styled-components'
import { Link } from 'gatsby'
import GlobalStoreContext from '../components/GlobalContext'
import Layout from '../components/layout'

const Scroll = styled.div`
  overflow-y: auto;
  max-height: 50vh;
`

export default function Home() {
  const GC = React.useContext(GlobalStoreContext)
  const { friends, setFriends } = GC
  const [localUsername, setLocalUsername] = React.useState(GC.username)
  const [localSteamId, setLocalSteamId] = React.useState(GC.steamId)
  const [filter, setFilter] = React.useState('')

  const debouncedLocalUsername = useDebounce(localUsername, 500)

  // eslint-disable-next-line
  let [getSteamIdResult, getSteamIdError, getSteamIdState] = usePromise(() => {
    if (
      typeof debouncedLocalUsername === 'string' &&
      debouncedLocalUsername.trim().length > 2 &&
      debouncedLocalUsername !== GC.username
    ) {
      console.debug('username changed - getSteamId', { debouncedLocalUsername, gcUsername: GC.username })
      GC.setUsername(debouncedLocalUsername)
      return API.getSteamId(debouncedLocalUsername)
        .then((sid) => {
          setLocalSteamId(sid)
          return sid
        })
        .catch((err) => {
          console.error(err.message)
          setLocalSteamId(null)
          return Promise.reject(err)
        })
    }
    return Promise.resolve(null)
  }, [GC.username, debouncedLocalUsername])

  // eslint-disable-next-line
  let [friendsData, getFriendsError, getFriendsState] = usePromise(() => {
    if (typeof localSteamId === 'string' && localSteamId.trim().length > 2 && localSteamId !== GC.steamId) {
      console.debug('steamId changed - getFriends', { localSteamId, gcSteamId: GC.steamId })
      GC.setSteamId(localSteamId)
      return API.getFriends(localSteamId).then((data) => {
        setFriends(data)
        return data
      })
    } else if (localSteamId === null) {
      GC.setSteamId(null)
      setFriends([])
    }
    return Promise.resolve(null)
  }, [localSteamId])

  const showAll = (show = true) => {
    friends.forEach((f) => {
      f.show = show
    })
    setFriends([...friends])
  }

  return (
    <Layout title="Choose Friends">
      <Container>
        <h1>SteamFriends</h1>

        {/* <div>GC: {JSON.stringify({ steamId: GC.steamId, username: GC.username, friends: Object.keys(friends).length }, null, 2)}</div>
        <div>SteamId  States: {JSON.stringify({ getSteamIdResult, getSteamIdError, getSteamIdState, localSteamId }, null, 2)}</div> */}

        {/* username */}
        <Input
          placeholder="Steam username"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          help={
            <>
              Use your Steam login username. N.B. Ensure your{' '}
              <a href="https://steamcommunity.com/my/edit/settings">steam profile</a> visibility is public, and you have
              a Custom URL setup.
            </>
          }
        />

        {/* status */}
        {/* eslint-disable */}
        <div>
          {getSteamIdState === 'pending'
            ? 'Searching for user...'
            : getSteamIdState === 'rejected' || (getSteamIdState === 'resolved' && localSteamId === null)
            ? 'User not found.'
            : getFriendsState === 'pending'
            ? 'Getting friends details...'
            : getFriendsState === 'rejected' || (getFriendsState === 'resolved' && friends && friends.length === 0)
            ? 'No friends found.'
            : null}
        </div>
        {/* eslint-enable */}

        {/* friends */}
        {getFriendsState === 'resolved' && friends && friends.length > 0 && (
          <div className="mt-3">
            <h3>Friends ({friends.length})</h3>
            <Input placeholder="Filter friends..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
              <ButtonGroup aria-label="Basic example" className="ml-auto">
                <Button variant="light" onClick={() => showAll(true)}>
                  Show All
                </Button>
                <Button variant="light" onClick={() => showAll(false)}>
                  Hide All
                </Button>
              </ButtonGroup>
            </ButtonToolbar>

            <Scroll className="border rounded">
              <FriendsList friends={friends} filter={filter} updateFriends={setFriends} />
            </Scroll>

            <Button
              as={Link}
              to={`/compareGames?sid=${friends
                .filter((f) => f.show === true)
                .map((f) => f.steamid)
                .join('&sid=')}`}
              className={`btn-block mt-3 ${friends.some((f) => f.show === true) ? '' : 'disabled'}`}
              size="lg"
              disabled={!friends.some((f) => f.show === true)}
            >
              Compare Games ({friends.filter((f) => f.show === true).length})
            </Button>
          </div>
        )}
      </Container>
    </Layout>
  )
}

import React from 'react'
import { Container, Form, ListGroup } from 'react-bootstrap'
import usePromise from 'react-use-promise'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import API from '../components/api'
import Friend from '../components/FriendCard'
import useDebounce from '../components/useDebounce'
import './app.css'

export default function Home() {
  const [username, setUsername] = React.useState('')

  const debouncedUsername = useDebounce(username, 500)
  // eslint-disable-next-line
  const [steamid, getSteamIdError, getSteamIdState] = usePromise(() => {
    if (typeof debouncedUsername === 'string' && debouncedUsername.length > 2) {
      return API.getVanityUrl(debouncedUsername)
    }
    return Promise.resolve(null)
  }, [debouncedUsername])
  // eslint-disable-next-line
  const [friendIds, getFriendIdsError, getFriendIdsState] = usePromise(() => {
    if (typeof steamid === 'string' && steamid.length > 2) return API.getFriends(steamid)
    return Promise.resolve(null)
  }, [steamid])
  // eslint-disable-next-line
  const [friends, getFriendsError, getFriendsState] = usePromise(() => {
    if (friendIds && friendIds.length > 0) {
      const ids = friendIds.map((f) => f.steamid)
      ids.push(steamid)
      return API.getFriendSummaries(ids)
    }
    return Promise.resolve(null)
  }, [steamid, friendIds])

  return (
    <div className="bg-dark text-light d-flex flex-column flex-grow-1 p-3">
      <Container>
        <h1>SteamFriends</h1>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            size="lg"
            placeholder="Steam username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Text>
            Use your Steam login username or custom url. N.B. Ensure your{' '}
            <a href="https://steamcommunity.com/my/edit/settings">steam profile</a> visibility is public, and you have a
            Custom URL setup.
          </Form.Text>
        </Form.Group>
        <div>
          {/* eslint-disable */}
          {getSteamIdState === 'pending'
            ? 'Searching for user...'
            : getSteamIdState === 'rejected'
            ? 'User not found.'
            : getSteamIdState === 'resolved' && steamid !== null
            ? `Found user - ${steamid}`
            : null}
          {/* eslint-enable */}
        </div>

        {getFriendIdsState === 'pending' ? (
          'Getting friends list...'
        ) : getFriendIdsState === 'rejected' || (friendIds && friendIds.length === 0) ? (
          'No friends found.'
        ) : getFriendsState === 'pending' ? (
          'Getting friends details...'
        ) : getFriendsState === 'rejected' || (friends && friends.length === 0) ? (
          'No friends found.'
        ) : getFriendsState === 'resolved' && friends && friends.length > 0 ? (
          <div className="mt-3">
            <h3>Friends ({friends.sort((a, b) => b.lastlogoff - a.lastlogoff).length})</h3>
            <ListGroup className="text-dark mt-3">
              {friends.map((f) => (
                <ListGroup.Item key={f.steamid}>
                  <Friend friend={f} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ) : null}
      </Container>
    </div>
  )
}

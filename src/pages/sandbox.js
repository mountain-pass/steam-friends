import React from 'react'
import { Container, ListGroup } from 'react-bootstrap'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Friend from '../components/FriendCard'
import './app.css'

const friend = {
  steamid: '76561198041997561',
  communityvisibilitystate: 3,
  profilestate: 1,
  personaname: 'Claxor',
  profileurl: 'https://steamcommunity.com/profiles/76561198041997561/',
  avatar:
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3b/3b7d4071ab660fa68f3a4b64a471450d8bfe59d3.jpg',
  avatarmedium:
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3b/3b7d4071ab660fa68f3a4b64a471450d8bfe59d3_medium.jpg',
  avatarfull:
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3b/3b7d4071ab660fa68f3a4b64a471450d8bfe59d3_full.jpg',
  avatarhash: '3b7d4071ab660fa68f3a4b64a471450d8bfe59d3',
  lastlogoff: 1576490260,
  personastate: 0,
  primaryclanid: '103582791432142217',
  timecreated: 1305627302,
  personastateflags: 0,
  loccountrycode: 'AU'
}

export default function Home() {
  return (
    <div className="bg-dark text-light d-flex flex-column flex-grow-1 p-3">
      <Container>
        <h1>Sandbox</h1>
        <ListGroup>
          <ListGroup.Item>
            <Friend friend={friend} />
          </ListGroup.Item>
        </ListGroup>
      </Container>
    </div>
  )
}

import React from 'react'
import { Container, ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import { FriendsList } from '../components/Friend'
import { Input } from '../components/Form'
import styled from 'styled-components'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const Scroll = styled.div`
  overflow-y: auto;
  max-height: 50vh;
`

const FRIENDS = [
  {
    steamid: '76561198822753557',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Pythian',
    profileurl: 'https://steamcommunity.com/id/jkohlbach/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    avatarhash: 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb',
    lastlogoff: 1585377301,
    personastate: 0,
    primaryclanid: '103582791429521408',
    timecreated: 1521191709,
    personastateflags: 0,
    loccountrycode: 'AU',
    locstatecode: 'QLD'
  },
  {
    steamid: '76561198043876813',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Walshen',
    profileurl: 'https://steamcommunity.com/profiles/76561198043876813/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    avatarhash: 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb',
    lastlogoff: 1595589435,
    personastate: 0,
    primaryclanid: '103582791429521408',
    timecreated: 1308958239,
    personastateflags: 0
  },
  {
    steamid: '76561197994944162',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'garlic',
    profileurl: 'https://steamcommunity.com/profiles/76561197994944162/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    avatarhash: 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb',
    lastlogoff: 1570446726,
    personastate: 0,
    primaryclanid: '103582791429521408',
    timecreated: 1197716987,
    personastateflags: 0
  },
  {
    steamid: '76561198355054466',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Melzor3',
    profileurl: 'https://steamcommunity.com/profiles/76561198355054466/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    avatarhash: 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb',
    lastlogoff: 1597405509,
    personastate: 0,
    primaryclanid: '103582791429521408',
    timecreated: 1482901839,
    personastateflags: 0
  },
  {
    steamid: '76561197975058543',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Vinn3H',
    profileurl: 'https://steamcommunity.com/profiles/76561197975058543/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b4/b461fc9a4a751d79a44141e5403971c975442c92.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b4/b461fc9a4a751d79a44141e5403971c975442c92_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b4/b461fc9a4a751d79a44141e5403971c975442c92_full.jpg',
    avatarhash: 'b461fc9a4a751d79a44141e5403971c975442c92',
    lastlogoff: 1597670505,
    personastate: 0,
    primaryclanid: '103582791429521408',
    timecreated: 1111721715,
    personastateflags: 0
  },
  {
    steamid: '76561198810682607',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Tom',
    profileurl: 'https://steamcommunity.com/id/tompahoward/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3b/3b8f0ff0ffd1f0f827885b855219fc35394a7051.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3b/3b8f0ff0ffd1f0f827885b855219fc35394a7051_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3b/3b8f0ff0ffd1f0f827885b855219fc35394a7051_full.jpg',
    avatarhash: '3b8f0ff0ffd1f0f827885b855219fc35394a7051',
    lastlogoff: 1587178930,
    personastate: 0,
    realname: 'Tom Howard',
    primaryclanid: '103582791462092284',
    timecreated: 1517442972,
    personastateflags: 0,
    loccountrycode: 'AU',
    locstatecode: 'NSW'
  },
  {
    steamid: '76561198188783386',
    communityvisibilitystate: 1,
    profilestate: 1,
    personaname: '[unassigned]',
    profileurl: 'https://steamcommunity.com/profiles/76561198188783386/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/92/92103d8223dba14f96a0d69cf30adae7a9cab199.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/92/92103d8223dba14f96a0d69cf30adae7a9cab199_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/92/92103d8223dba14f96a0d69cf30adae7a9cab199_full.jpg',
    avatarhash: '92103d8223dba14f96a0d69cf30adae7a9cab199',
    lastlogoff: 1429645709,
    personastate: 0,
    personastateflags: 0
  },
  {
    steamid: '76561198085733667',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Dude!!!',
    profileurl: 'https://steamcommunity.com/id/samw2k00/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a2/a299b505de61d7045c9a1680268de22d1be70142.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a2/a299b505de61d7045c9a1680268de22d1be70142_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a2/a299b505de61d7045c9a1680268de22d1be70142_full.jpg',
    avatarhash: 'a299b505de61d7045c9a1680268de22d1be70142',
    lastlogoff: 1597412556,
    personastate: 0,
    realname: 'Sam Wei',
    primaryclanid: '103582791459896772',
    timecreated: 1362694648,
    personastateflags: 0,
    loccountrycode: 'AU'
  },
  {
    steamid: '76561198013732389',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Goldie',
    profileurl: 'https://steamcommunity.com/profiles/76561198013732389/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/54/54a2eca15b3331000e718e1f98489f75ae73d133.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/54/54a2eca15b3331000e718e1f98489f75ae73d133_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/54/54a2eca15b3331000e718e1f98489f75ae73d133_full.jpg',
    avatarhash: '54a2eca15b3331000e718e1f98489f75ae73d133',
    lastlogoff: 1596263790,
    personastate: 0,
    primaryclanid: '103582791433758923',
    timecreated: 1253186859,
    personastateflags: 0
  },
  {
    steamid: '76561198040810379',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'Blood_Jester',
    commentpermission: 2,
    profileurl: 'https://steamcommunity.com/profiles/76561198040810379/',
    avatar:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/25/253ce618c5721331b8fff09705e45711cd7cbc95.jpg',
    avatarmedium:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/25/253ce618c5721331b8fff09705e45711cd7cbc95_medium.jpg',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/25/253ce618c5721331b8fff09705e45711cd7cbc95_full.jpg',
    avatarhash: '253ce618c5721331b8fff09705e45711cd7cbc95',
    lastlogoff: 1597663370,
    personastate: 0,
    primaryclanid: '103582791429521408',
    timecreated: 1303231740,
    personastateflags: 0
  }
]

export default function Home() {
  const [friends, setFriends] = React.useState(FRIENDS)
  const [filter, setFilter] = React.useState('')

  const showAll = (show = true) => {
    friends.forEach((f) => {
      f.show = show
    })
    setFriends([...friends])
  }

  return (
    <Layout title="Sandbox">
      <Container>
        <h1>SteamFriends</h1>
        <Button as={Link} to="/compareGames?sid=123&amp;sid=456">
          Show compare games
        </Button>
        <h3>Selected = {friends.filter((f) => f.show === true).length}</h3>
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
      </Container>
    </Layout>
  )
}

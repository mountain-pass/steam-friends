import React from 'react'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './app.css'
import { Form, Container } from 'react-bootstrap'
import useDebounce from '../components/useDebounce'
import API from '../components/api'

export default function Home() {
  const [username, setUsername] = React.useState('')

  const debouncedUsername = useDebounce(username, 500)

  React.useEffect(() => {
    if (typeof debouncedUsername === 'string' && debouncedUsername.length > 2) {
      API.getVanityUrl(debouncedUsername).then(console.log)
    }
  }, [debouncedUsername])

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
        </Form.Group>
      </Container>
    </div>
  )
}

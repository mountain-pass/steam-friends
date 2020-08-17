import React from 'react'
import { Container } from 'react-bootstrap'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './app.css'

export default function NotFound() {
  return (
    <div className="bg-dark text-light d-flex flex-column flex-grow-1 p-3">
      <Container>
        <h1>Page not found</h1>
      </Container>
    </div>
  )
}

import React from 'react'
import { Form } from 'react-bootstrap'

export const Input = ({ label = null, nopad = false, nomargin = false, help = null, ...props }) => (
  <Form.Group controlId={label} className={nopad ? 'p-0' : nomargin ? 'm-0' : ''}>
    {label !== null && <Form.Label>{label}</Form.Label>}
    <Form.Control autoFocus type="text" size="lg" {...props} />
    {help !== null && <Form.Text>{help}</Form.Text>}
  </Form.Group>
)

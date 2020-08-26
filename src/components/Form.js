import React from 'react'
import { Form } from 'react-bootstrap'

export const Input = ({ label = null, nopad = false, size = 'lg', nomargin = false, help = null, ...props }) => (
  <Form.Group controlId={label} className={nopad ? 'p-0' : nomargin ? 'm-0' : ''}>
    {label !== null && <Form.Label>{label}</Form.Label>}
    <Form.Control autoFocus type="text" size={size} {...props} />
    {help !== null && <Form.Text>{help}</Form.Text>}
  </Form.Group>
)

import React from 'react'
import { Dropdown } from 'react-bootstrap'
import styled from 'styled-components'

const DropdownToggle = styled(Dropdown.Toggle)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NOOP = () => {}

export default ({
  options = [],
  onChange = NOOP,
  onValueChange = NOOP,
  className = '',
  variant = 'outline-primary',
  ...props
}) => {
  const [selected, setSelected] = React.useState(options[0])

  return (
    <Dropdown>
      <DropdownToggle variant={variant} className={`btn-block ${className}`} {...props}>
        {selected.k}
      </DropdownToggle>

      <Dropdown.Menu>
        {options.map((o) => (
          <Dropdown.Item
            key={o.k}
            onClick={() => {
              setSelected(o)
              onChange(o)
              onValueChange(o.v)
            }}
          >
            {o.k}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

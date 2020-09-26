import React from 'react'
import SelectDropdown from '../components/custom/SelectDropdown'
import { MULTIPLAYER_FILTERS } from '../components/custom/Filters'

export default (props) => {
  const [selected, setSelected] = React.useState(null)

  return (
    <div className="text-white p-3">
      <h1>Kitchen Sink</h1>
      <h3>Dropdown (selected={selected && selected.k})</h3>
      <div style={{ border: '1px solid red', width: '100px' }}>
        <SelectDropdown size="lg" options={MULTIPLAYER_FILTERS} onChange={setSelected} />
      </div>
    </div>
  )
}

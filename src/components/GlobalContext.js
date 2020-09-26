import PropTypes from 'prop-types'
import React, { useState } from 'react'

const defaultState = {
  setUsername: () => {},
  setSteamId: () => {},
  setFriends: () => {},
  username: '',
  steamId: null,
  friends: []
}

export const GlobalStoreContext = React.createContext(defaultState)

export const GlobalStoreProvider = (props) => {
  const [state, setState] = useState(() => {
    return {
      setUsername: (username) => setState((ps) => ({ ...ps, username })),
      setSteamId: (steamId) => setState((ps) => ({ ...ps, steamId })),
      setFriends: (friends) => setState((ps) => ({ ...ps, friends: [...friends] })),
      username: '',
      steamId: null,
      friends: []
    }
  })

  return <GlobalStoreContext.Provider value={state}>{props.children}</GlobalStoreContext.Provider>
}
GlobalStoreProvider.propTypes = {
  children: PropTypes.any
}

export default GlobalStoreContext

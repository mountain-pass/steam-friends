import React, { Component } from 'react';
import _ from 'underscore'
import SteamAPI from './SteamAPI'

const form = (thiz, label, key, onChangeFn = () => {}, atts = {}) => {
  return  <div className="form">
    <label>{ label }:</label>
    <input type="text" value={thiz.state[key]} onChange={e => { thiz.setState({ [key]: e.target.value }); onChangeFn(e, key, e.target.value); }} {...atts} />
  </div>
}

let API = null

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      steamApiKey: 'FOOBAR',
      username: 'xx'
    }
    this.getLocal = this.getLocal.bind(this)
    this.putLocal = this.putLocal.bind(this)
  }

  componentDidMount() {
    this.getLocal('steamApiKey')
    this.getLocal('username')
  }

  componentDidUpdate(prevProps, prevState) {
    const { steamApiKey, username } = this.state
    if (prevState.steamApiKey !== steamApiKey && typeof steamApiKey === 'string' && steamApiKey.length > 1) {
      API = SteamAPI(steamApiKey)
    }
    if (prevState.username !== username && typeof username === 'string' && username.length > 1) {
      API.getVanityUrl(username)
    }
  }

  getLocal(key) {
    const tmp = localStorage.getItem(key)
    if (tmp) {
      this.setState({ [key]: tmp })
    }
  }

  putLocal(e, key, val) {
    localStorage.setItem(key, val)
  }

  render() {
    const { steamApiKey } = this.state
    return (
      <div className="App">
        <h1>Steam Friends</h1>

        { form(this, <a target="_blank" href={SteamAPI.GET_KEY_URL}>Steam Api Key</a>, 'steamApiKey', this.putLocal, { autoFocus: true })}
        { steamApiKey ? form(this, 'Username', 'username', this.putLocal) : <i className="form text-muted">Please complete above step</i> }

      </div>
    );
  }
}

export default App;

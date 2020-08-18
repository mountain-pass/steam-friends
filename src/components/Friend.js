import React from 'react'
import { Badge, Button, Table } from 'react-bootstrap'

export const showName = (friend) => (
  <>
    {friend.realname && friend.personaname ? (
      <>
        {friend.personaname}
        <span className="ml-2 text-muted">({friend.realname})</span>
      </>
    ) : friend.realname ? (
      friend.realname
    ) : friend.personaname ? (
      friend.personaname
    ) : null}
  </>
)

export const FriendIcon = ({ friend = {}, ...props }) => {
  return (
    <img
      width={40}
      height={40}
      src={friend ? friend.avatarmedium : null}
      alt="Generic placeholder"
      className="rounded border border-dark mr-2"
    />
  )
}

export const FriendSummary = ({ friend = {}, ...props }) => {
  return (
    <>
      <img
        width={40}
        height={40}
        src={friend.avatarmedium}
        alt="Generic placeholder"
        className="rounded border border-dark mr-2"
      />
      <div className="text-dark text-truncate flex-grow-1">{showName(friend)}</div>
      <Badge variant="primary">{friend.loccountrycode}</Badge>
    </>
  )
}

export const FriendsList = ({ friends = [], updateFriends, filter = '', ...props }) => {
  const [filterRegex, setFilterRegex] = React.useState(null)
  const [localFriends, setLocalFriends] = React.useState([])

  React.useEffect(() => {
    setLocalFriends(friends)
  }, [friends])

  React.useEffect(() => {
    if (typeof filter === 'string' && filter.trim().length > 0) setFilterRegex(new RegExp(filter, 'i'))
    else setFilterRegex(null)
  }, [filter])

  const toggleShow = (f) => {
    f.show = f.show !== true
    updateFriends([...friends])
  }

  return (
    <Table className="bg-white m-0">
      <tbody>
        {localFriends
          .filter(
            (f) =>
              filterRegex === null ||
              (typeof f.realname === 'string' && f.realname.match(filterRegex)) ||
              (typeof f.personaname === 'string' && f.personaname.match(filterRegex))
          )
          .sort((a, b) => b.lastlogoff - a.lastlogoff)
          .map((f) => (
            <tr
              key={f.steamid}
              className={`align-items-center text-large pointer ${f.show === true ? '' : 'transparent'}`}
            >
              <td className="p-2" onClick={() => toggleShow(f)}>
                <img
                  width={40}
                  height={40}
                  src={f.avatarmedium}
                  alt="Generic placeholder"
                  className="rounded border border-dark"
                />
              </td>
              <td className="p-2 w-100 align-middle" onClick={() => toggleShow(f)}>
                {showName(f)}
              </td>
              <td onClick={() => toggleShow(f)} className="d-flex justify-content-end">
                <Button size="sm" variant={f.show === true ? 'outline-primary' : 'outline-dark'} className="clickthru">
                  {f.show === true ? 'Show' : 'Hidden'}
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  )
}

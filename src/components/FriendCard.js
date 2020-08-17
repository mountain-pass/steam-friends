import React from 'react'
import { Media, Table } from 'react-bootstrap'

const Friend = ({ friend = {}, ...props }) => {
  return (
    <>
      <Media>
        <img width={64} height={64} className="mr-3" src={friend.avatarmedium} alt="Generic placeholder" />
        <Media.Body>
          <h5 className="text-dark">
            {friend.realname || '-'} aka &quot;{friend.personaname || '-'}&quot;
          </h5>
          <Table size="sm" className="m-0 text-tiny">
            <tr>
              <th>Country:</th>
              <td>{friend.loccountrycode}</td>
            </tr>
            <tr>
              <th>SteamId:</th>
              <td>
                <a href={friend.profileurl} target="_blank" rel="noreferrer">
                  {friend.steamid || '-'}
                </a>
              </td>
            </tr>
            <tr>
              <th>Last Seen:</th>
              <td>{new Date(friend.lastlogoff * 1000).toDateString()}</td>
            </tr>
          </Table>
        </Media.Body>
      </Media>
    </>
  )
}

export default Friend

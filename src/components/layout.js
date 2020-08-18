import React from 'react'
import { Helmet } from 'react-helmet'

export default function Home({ title = 'Home', children = null, ...props }) {
  const description = 'Compare shared games with your Steam friends.'
  const author = 'nick@mountain-pass.com.au'
  return (
    <div className="bg-dark text-light d-flex flex-column flex-grow-1 p-3">
      <Helmet
        htmlAttributes={{
          lang: 'en'
        }}
        title={title}
        titleTemplate={'%s | SteamFriends'}
        meta={[
          {
            name: 'description',
            content: description
          },
          {
            property: 'og:title',
            content: title
          },
          {
            property: 'og:description',
            content: description
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            name: 'twitter:card',
            content: 'summary'
          },
          {
            name: 'twitter:creator',
            content: author
          },
          {
            name: 'twitter:title',
            content: title
          },
          {
            name: 'twitter:description',
            content: description
          }
        ]}
      />
      {children}
    </div>
  )
}

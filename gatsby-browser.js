/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import PropTypes from 'prop-types'
import React from 'react'
import { GlobalStoreProvider } from './src/components/GlobalContext'
import './node_modules/bootstrap/dist/css/bootstrap.min.css'
import './src/pages/app.css'

export const wrapRootElement = ({ element }) => <GlobalStoreProvider>{element}</GlobalStoreProvider>

wrapRootElement.propTypes = {
  element: PropTypes.any
}

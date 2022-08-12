import React from 'react'
import { Auth0Provider } from '@auth0/auth0-react'
import authConfig from './authConfig'
import { useNavigate } from '@reach/router'

export function OauthProvider({ children }) {
  const { domain, clientId, scopes, audience } = authConfig
  const navigate = useNavigate()

  function handleRedirect(state) {
    navigate(state.returnTo || window.location.pathname)
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      scopes={scopes.join(' ')}
      audience={audience}
      cacheLocation="localstorage"
      onRedirectCallback={handleRedirect}
    >
      {children}
    </Auth0Provider>
  )
}

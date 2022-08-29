import { Auth0Client } from '@auth0/auth0-spa-js'

export const AUTH_MODES = {
  RAW: 'RAW',
  OAUTH: 'OAUTH'
}

export const authClient = new Auth0Client({
  domain: authConfig.domain,
  audience: authConfig.audience,
  cacheLocation: 'localstorage',
  client_id: authConfig.clientId,
  redirect_uri: window.location.origin,
  scope: authConfig.scopes.join(' ')
})

export const authConfig = {
  domain: 'auth.carto.com',
  clientId: 'LF6ilhaCyJh3jhKcRf0mm8pBJIVrQ5sk',
  audience: 'carto-cloud-native-api',
  authorizeEndPoint: 'https://carto.com/oauth2/authorize', // only valid if keeping https://localhost:3000/oauthCallback
  scopes: ['read:current_user', 'read:connections', 'read:account']
}

export function decodeToken(token) {
  if (!token) {
    return null
  }

  let info = null
  try {
    info = JSON.parse(window.atob(token.split('.')[1]))
  } catch (e) {
    // pass
  }

  const now = new Date().getTime() + 1000 // 1s margin
  const expireMS = info?.exp * 1000
  const isValid = expireMS > now

  return (
    info &&
    isValid && {
      id: info['http://app.carto.com/account_id'],
      email: info['http://app.carto.com/email'],
      permissions: info.permissions,
      expireMS
    }
  )
}

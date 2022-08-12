const authConfig = {
  domain: 'auth.carto.com',
  clientId: 'LF6ilhaCyJh3jhKcRf0mm8pBJIVrQ5sk',
  audience: 'carto-cloud-native-api',
  authorizeEndPoint: 'https://carto.com/oauth2/authorize', // only valid if keeping https://localhost:3000/oauthCallback
  scopes: ['read:current_user', 'read:connections', 'read:account']
}

export default authConfig

// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'mdfarvez.eu.auth0.com',            // Auth0 domain
  clientId: 'xuOrSHbtHtMwjyToLo0O4WMbCgTP2Nlc',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

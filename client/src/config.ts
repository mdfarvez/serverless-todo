const apiId = '****' // Auth0 appId
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  domain: '***',            // Auth0 domain
  clientId: '***',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

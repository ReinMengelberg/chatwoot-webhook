import * as sdk from 'botpress/sdk'

export default async (bp: typeof sdk) => {

  const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9AbWVuZ2VsbWFubi5ubCIsInN0cmF0ZWd5IjoiZGVmYXVsdCIsInRva2VuVmVyc2lvbiI6MSwiaXNTdXBlckFkbWluIjp0cnVlLCJpYXQiOjE3MTg5ODY2ODUsImV4cCI6MjAzNDU2MjY4NSwiYXVkIjoiY29sbGFib3JhdG9ycyJ9.BY7suW6VDoJXDR7rsqMGoTlWUsgVAcKqQP4LXrVC7IQ"

  export const setupAPIEndpoint = (bp: typeof sdk) => {
    const router = bp.http.createRouterForBot('rocketchat-webhook', { checkAuthentication: false })
  
    router.post('/api-endpoint', async (req, res) => {
      const tokenHeader = req.headers['Authorization']
  
      if (!tokenHeader || tokenHeader !== JWT_TOKEN) {
        res.status(403).send('Forbidden: Invalid Token')
        return
      }

  // Link to access this route: http://localhost:3000/api/v1/bots/BOT_NAME/mod/starter-module/my-first-route
  router.get('/my-first-route', async (req, res) => {
    // Since the bot ID is required to access your module,
    const botId = req.params.botId


    res.sendStatus(200)
  })
}

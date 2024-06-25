import * as sdk from 'botpress/sdk'
import { handleIncomingMessage } from './message-handler'

const ROCKETCHAT_TOKEN = "token1234"

export const setupWebhookEndpoint = (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('rocketchat-webhook', { checkAuthentication: false })

  router.post('/endpoint', async (req, res) => {
    const tokenHeader = req.headers['x-rocketchat-livechat-token']

    if (!hostHeader || !hostHeader.includes(ROCKETCHAT_TOKEN)) {
      res.status(403).send('Forbidden: Invalid Host')
      return
    }

    const { messages, agent, visitor } = req.body

    if (!messages || !agent || !visitor) {
      res.status(400).send('messages, agent, and visitor are required')
      return
    }

    if (!agent.username.startsWith('aiex')) {
      res.status(200).send('Agent username does not match criteria, ignoring message')
      return
    }

    await handleIncomingMessage(bp, req.body)
    res.status(200).send('Payload processed')
  })
}

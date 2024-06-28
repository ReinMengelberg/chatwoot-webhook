import * as sdk from 'botpress/sdk'
import { handleOutgoingTemplate } from './template-handler'

const ROCKETCHAT_TOKEN = "U8rL3F9nqzW1YbD7xM2aNvK6eX0pJcQ4sT5hZjVwP8mL1yRq"

export const setupTemplateEndpoint = (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('rocketchat-webhook', { checkAuthentication: false })

  router.post('/template-endpoint', async (req, res) => {
    const tokenHeader = req.headers['x-rocketchat-livechat-token']

    if (!tokenHeader || tokenHeader !== ROCKETCHAT_TOKEN) {
      res.status(403).send('Forbidden: Invalid Token')
      return
    }

    // CHECK EVENT 
    
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

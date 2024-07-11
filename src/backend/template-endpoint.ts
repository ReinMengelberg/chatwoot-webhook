import * as sdk from 'botpress/sdk'
import { handleOutgoingTemplate } from './template-handler'

const ROCKETCHAT_TOKEN = "U8rL3F9nqzW1YbD7xM2aNvK6eX0pJcQ4sT5hZjVwP8mL1yRq"

export const setupTemplateEndpoint = (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('rocketchat-webhook', { checkAuthentication: false })

  router.post('/template-endpoint', async (req, res) => {
    const tokenHeader = req.headers['x-rocketchat-livechat-token']

    if (!tokenHeader || tokenHeader !== ROCKETCHAT_TOKEN) {
      bp.logger.error('Invalid or missing Rocket.Chat token')
      res.status(403).send('Forbidden: Invalid Token')
      return
    }

    const { medium, rocket_chat_url, template, agent, visitor } = req.body

    if (!medium || !rocket_chat_url || !template || !agent || !visitor) {
      bp.logger.error('Invalid request payload: medium, rocket_chat_url, template, agent, and visitor are required')
      res.status(400).send('medium, rocket_chat_url, template, agent, and visitor are required')
      return
    }

    try {
      await handleOutgoingTemplate(bp, req.body)
      res.status(200).send('Payload processed')
    } catch (error) {
      bp.logger.error('Error handling outgoing template', error)
      res.status(500).send('Internal Server Error')
    }
  })
}

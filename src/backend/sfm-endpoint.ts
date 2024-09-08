import * as sdk from 'botpress/sdk'
import { sendFirstMessage } from './sfm-processor'

export const setupSfmEndpoint = async (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('chatwoot-webhook', { checkAuthentication: false })

  // Retrieve variables from config
  const config = await bp.config.getModuleConfig('chatwoot-webhook')
  const secure_string = config.secureString;

  router.post(`/sfm-endpoint/${secure_string}`, async (req, res) => {

    // Check request
    const {account, inbox, bot, contact, conversation, message} = req.body

    if (!account || !inbox || !bot || !contact || !conversation || !message) {
      bp.logger.warn('Chatwoot-Webhook invalid request payload on /sfm-endpoint')
      res.status(400).json({ error: "account, inbox, bot, contact, conversation and messages are required"})
      return
    }

    try {
      await sendFirstMessage(bp, req.body)
      res.status(200).json({ success: "payload processed" })
    } catch (error) {
      bp.logger.error(`Error when sending first message recieved from /sfm-endpoint: ${error}`)
      res.status(500).json({ error: `${error}` })
    }
  })
}

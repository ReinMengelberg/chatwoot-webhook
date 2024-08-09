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
      bp.logger.error('Invalid request payload: account, inbox, bot, contact, conversation and message are required')
      res.status(400).send('Invalid request payload: account, inbox, bot, contact, conversation and message are required')
      return
    }

    try {
      await sendFirstMessage(bp, req.body)
      res.status(200).send('Payload processed')
    } catch (error) {
      bp.logger.error(`Error when sending first message: ${error}`)
      res.status(500).send(`Error when sending first message: ${error}`)
    }
  })
}

import * as sdk from 'botpress/sdk'
import { processFirstMessage } from './pfm-processor'

export const setupPfmEndpoint = async (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('chatwoot-webhook', { checkAuthentication: false })

  // Retrieve variables from config
  const config = await bp.config.getModuleConfig('chatwoot-webhook')
  const secure_string = config.secureString;

  router.post(`/pfm-endpoint/${secure_string}`, async (req, res) => {

    // Check request
    const {account, inbox, contact, conversation, message} = req.body

    if (!account || !inbox || !contact || !conversation || !message) {
      bp.logger.error('Invalid request payload: account, inbox, contact, conversation and message are required')
      res.status(400).send('Invalid request payload: account, inbox, contact, conversation and message are required')
      return
    }

    try {
      await processFirstMessage(bp, req.body)
      res.status(200).send('Payload processed')
    } catch (error) {
      bp.logger.error(`Error when processing first message: ${error}`)
      res.status(500).send(`Error when processing first message: ${error}`)
    }
  })
}

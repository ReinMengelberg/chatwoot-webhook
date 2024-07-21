import * as sdk from 'botpress/sdk'
import { processFirstMessage } from './pfm-processor'

export const setupPfmEndpoint = (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('chatwoot-webhook', { checkAuthentication: false })

  // Set secure_string
  const secure_string = "e7efaba6b6d6f8cac735031582cd97d5c41431ea9cbc155e333aed7ec05cd62c";

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

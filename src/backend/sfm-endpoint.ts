import * as sdk from 'botpress/sdk'
import { sendFirstMessage } from './sfm-handler'

export const setupSfmEndpoint = (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('chatwoot-webhook', { checkAuthentication: false })
  const secure_string = 'e7efaba6b6d6f8cac735031582cd97d5c41431ea9cbc155e333aed7ec05cd62c';

  router.post(`/sfm-endpoint/${secure_string}`, async (req, res) => {

    const {account, inbox, contact, message} = req.body

    if (!account || !inbox || !contact || !message) {
      bp.logger.error('Invalid request payload: account, inbox, contact and message are required')
      res.status(400).send('Invalid request payload: account, inbox, contact and message are required')
      return
    }

    try {
      await startNewConversation(bp, req.body)
      res.status(200).send('Payload processed')
    } catch (error) {
      bp.logger.error(`Error when starting new conversation: ${error}`)
      res.status(500).send(`Error when starting new conversation: ${error}`)
    }
  })
}

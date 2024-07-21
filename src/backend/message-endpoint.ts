import * as sdk from 'botpress/sdk'
import { processIncomingMessage } from './message-processor'

export const setupMessageEndpoint = async (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('chatwoot-webhook', { checkAuthentication: false })

  // Retrieve variables from config
  const config = await bp.config.getModuleConfig('chatwoot-webhook')
  const secure_string = config.secureString;

  router.post(`/message-endpoint/${secure_string}`, async (req, res) => {

    // Check request
    const { account, conversation, inbox, message_type, sender, event } = req.body;

    if (!account || !conversation || !inbox || !message_type || !sender || !event) {
      bp.logger.error('Invalid request payload: account, conversation, inbox, message_type, sender and event are required')
      res.status(400).send('Invalid request payload: account, conversation, inbox, message_type, sender and event are required');
      return;
    }

    const conversation_status = conversation.status;
    if (conversation_status != 'pending') {
      res.status(200).send('Conversation status != pending, ignoring message');
      return;
    }

    if (event != 'message_created') {
      res.status(200).send('event != message_created, ignoring message');
      return;
    }

    if (message_type != 'incoming') {
      res.status(200).send('message_type != incoming, ignoring message');
      return;
    }

    // Send to handleIncomingMessage
    try {
      await processIncomingMessage(bp, req.body);
      res.status(200).send('Payload processed');
    } catch (error) {
      bp.logger.error(`Error when processing incoming message: ${error}`)
      res.status(500).send(`Error when processing incoming message: ${error}`)
    }
  });
}


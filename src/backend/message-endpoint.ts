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
      bp.logger.warning('Chatwoot-Webhook invalid request payload on /message-endpoint')
      res.status(400).json({ error: "account, inbox, bot, contact, conversation and messages are required" })
      return;
    }

    const conversation_status = conversation.status;
    if (conversation_status != 'pending') {
      res.status(200).json({ info: "conversation status != pending, ignoring message" });
      return;
    }

    if (event != 'message_created') {
      res.status(200).json({ info: "message_type != incoming, ignoring message" });
      return;
    }

    if (message_type != 'incoming') {
      res.status(200).send('{"info":"message_type != incoming, ignoring message"}');
      return;
    }

    // Send to handleIncomingMessage
    try {
      await processIncomingMessage(bp, req.body);
      res.status(200).json({ success : "payload processed"});
    } catch (error) {
      bp.logger.error(`Error when processing incoming message: ${error}`)
      res.status(500).json({ error: `${error}` })
    }
  });
}


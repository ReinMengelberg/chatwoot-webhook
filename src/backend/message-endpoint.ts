import * as sdk from 'botpress/sdk'
import { handleIncomingMessage } from './message-handler'

export const setupMessageEndpoint = (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('aiex-webhook', { checkAuthentication: false })
  const secure_string = 'e7efaba6b6d6f8cac735031582cd97d5c41431ea9cbc155e333aed7ec05cd62c';

  router.post(`/message-endpoint/${secure_string}`, async (req, res) => {
    // CHECK REQUEST
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

    await handleIncomingMessage(bp, req.body);
    res.status(200).send('Payload processed');
  });
}


saimport * as sdk from 'botpress/sdk'

export const handleIncomingMessage = async (bp: typeof sdk, payload: any) => {
  try {
    // Retrieve Account Data
    const account_id = payload.account.id;
    const account_name = payload.account.name.toLowerCase().replace(/\s+/g, '-');

    // Retrieve Inbox Data
    const inbox_id = payload.inbox.id;
    const inbox_name = payload.inbox.name.toLowerCase().replace(/\s+/g, '-');

    if (!account_id || !account_name || !inbox_id || !inbox_name) {
      throw new Error('Missing required account or inbox fields');
    }
    
    // Retrieve Conversation Data
    const channel = payload.conversation.channel;
    const conversation_id = payload.conversation.id;

    // Retrieve User Data
    const user_id = payload.sender.id;
    const user_name = payload.sender.name;
    const user_phone = payload.sender.phone_number;
    const user_email = payload.sender.email;
    const user_identifier = payload.sender.identifier;
    const user_additional_attributes = payload.sender.additional_attributes;
    const user_custom_attributes = payload.sender.custom_attributes;

    // Create bot_id dynamically
    const bot_id = `aiex-${account_name}-${inbox_name}`;

    // Ensure messages is an array and access the first message
    const messages = payload.conversation.messages
    if (!Array.isArray(messages) || payload.conversation.messages.length === 0) {
      throw new Error('Messages array is missing or empty')
    }

    const message = payload.conversation.messages[0]
    const message_text = message.content
    const message_id = message.id
    const message_time = message.updated_at

    if (!bot_id || !user_id || !user_name || !conversation_id || !message_text ||
      (!user_email && !user_phone && !user_identifier)) {
    throw new Error('Missing required payload fields')
  }

    const chatwoot_channel = `Account#${account_id}_${account_name}_Inbox#${inbox_id}_${inbox_name}`

    // Check if the user exists
    let user = await bp.users.getOrCreateUser(chatwoot_channel, user_id);

    // Fetch user memory
    const userMemory = await bp.users.getAttributes(chatwoot_channel, user_id);

    // Update user memory with user data if not already set
    if (!userMemory.userId && user_id !== undefined) {
      await bp.users.updateAttributes(chatwoot_channel, user_id, { userId: user_id });
    }

    if (!userMemory.userName && user_name !== undefined) {
      await bp.users.updateAttributes(chatwoot_channel, user_id, { userName: user_name });
    }

    if (!userMemory.userPhone && user_phone !== undefined) {
      await bp.users.updateAttributes(chatwoot_channel, user_id, { userPhone: user_phone });
    }

    if (!userMemory.userEmail && user_email !== undefined) {
      await bp.users.updateAttributes(chatwoot_channel, user_id, { userEmail: user_email });
    }

    if (!userMemory.userIdentifier && user_identifier !== undefined) {
      await bp.users.updateAttributes(chatwoot_channel, user_id, { userIdentifier: user_identifier });
    }

    if (!userMemory.userAdditionalAttributes && user_additional_attributes !== undefined) {
      await bp.users.updateAttributes(chatwoot_channel, user_id, { userAdditionalAttributes: user_additional_attributes });
    }

    if (!userMemory.userCustomAttributes && user_custom_attributes !== undefined) {
      await bp.users.updateAttributes(chatwoot_channel, user_id, { userCustomAttributes: user_custom_attributes });
    }

    // Construct the event
    const event: sdk.IO.IncomingEvent = {
      type: "text",
      channel: chatwoot_channel,
      direction: "incoming",
      payload: {
        type: "text",
        text: message_text,
        timezone: 2, // Adjust if necessary
        language: "nl", // Adjust if necessary
      },
      target: user_id,
      botId: bot_id,
      createdOn: message_time,
      threadId: conversation_id,
      id: message_id,
      preview: message_text,
      hasFlag: () => false,
      setFlag: () => {},
      state: {
        __stacktrace: [],
        user: {
          userId: user_id,
          userName: user_name,
          userPhone: user_phone,
          userEmail: user_email,
          userIdentifier: user_identifier,
          userAdditionalAttributes: user_additional_attributes,
          userCustomAttributes: user_custom_attributes,
          timezone: 2, // Adjust if necessary
          language: "nl", // Adjust if necessary
        },
        context: {},
        session: {
          lastMessages: [],
          workflows: {}
        },
        temp: {},
        bot: {},
        workflow: {
          eventId: message_id,
          status: 'active',
        }
      },
      suggestions: [],
    }

    // Send the event to the Botpress server
    await bp.events.sendEvent(event)
  } catch (error) {
    bp.logger.error('Error processing incoming message', error)
  }
}





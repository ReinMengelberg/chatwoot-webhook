import * as sdk from 'botpress/sdk'

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
    if (!Array.isArray(messages) || messages.length === 0) {
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

    // Create chatwoot_channel
    const chatwoot_channel = `Account#${account_id}${account_name}_Inbox#${inbox_id}${inbox_name}`

    // Create accountData object
    const accountData: Record<string, any> = {};
    if (account_id) accountData.id = account_id;
    if (account_name) accountData.name = account_name;

    // Create inboxData object
    const inboxData: Record<string, any> = {};
    if (inbox_id) inboxData.id = inbox_id;
    if (inbox_name) inboxData.name = inbox_name;

    // Create userData object
    const userData: Record<string, any> = {};
    if (user_id) userData.userId = user_id;
    if (user_name) userData.userName = user_name;
    if (user_phone) userData.userPhone = user_phone;
    if (user_email) userData.userEmail = user_email;
    if (user_identifier) userData.userIdentifier = user_identifier;
    if (user_additional_attributes) userData.userAdditionalAttributes = user_additional_attributes;
    if (user_custom_attributes) userData.userCustomAttributes = user_custom_attributes;

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
        accountData,
        inboxData,
        userData,
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
          timezone: 2, // Adjust if necessary
          language: "nl", // Adjust if necessary
        },
        context: {},
        session: {
          lastMessages: [],
          workflows: {},
        },
        temp: {},
        bot: {},
        workflow: {
          eventId: message_id,
          status: 'active',
        },
      },
      suggestions: [],
    };

    // Send the event to the Botpress server
    await bp.events.sendEvent(event);
  } catch (error) {
    bp.logger.error('Error processing incoming message', error);
  }
};

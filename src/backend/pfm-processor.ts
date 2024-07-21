import * as sdk from 'botpress/sdk';

export const processFirstMessage = async (bp: typeof sdk, payload: any) => {
  try {
    // Retrieve variables from config
    const config = await bp.config.getModuleConfig('chatwoot-webhook')
    const secure_string = config.secureString;
    const timezone = config.timezone;
    const language = config.languageCode;
    
    // Retrieve Account Data
    const account_id = payload.account.id;
    const account_name = payload.account.name.toLowerCase().replace(/\s+/g, '-');

    // Retrieve Inbox Data
    const inbox_id = payload.inbox.id;
    const inbox_name = payload.inbox.name.toLowerCase().replace(/\s+/g, '-');

    if (!account_id || !account_name || !inbox_id || !inbox_name) {
      throw new Error('Missing required account or inbox fields in payload');
    }

    // Retrieve conversation_id
    const conversation_id = payload.conversation.id
    if (!conversation_id) {
      throw new Error('Missing conversation_id in payload');
    }

    // Create bot_id dynamically
    const bot_id = `aiex-${account_name}-${inbox_name}`;

    // Retrieve User Data
    const user_id = payload.contact.id
    const user_name = payload.contact.name;
    const user_phone = payload.contact.phone;
    const user_email = payload.contact.email;
    const user_identifier = payload.contact.identifier;
    const user_additional_attributes = payload.contact.additional_attributes;
    const user_custom_attributes = payload.contact.custom_attributes;

    // Message Variables
    const message_time = new Date();

    // Retrieve firstMessage
    const first_message = payload.message.content;
    
    // Retrieve templateMessage variables
    const template_id = payload.message.template.id;
    const template_category = payload.message.template.category;
    const template_language_code = payload.message.template.language_code;
    const template_variable_2 = payload.message.template.variable_2;
    const template_variable_3 = payload.message.template.variable_3;
    const template_variable_4 = payload.message.template.variable_4;
    const template_variable_5 = payload.message.template.variable_5;
    const template_variable_6 = payload.message.template.variable_6;
    const template_variable_7 = payload.message.template.variable_7;
    const template_variable_8 = payload.message.template.variable_8;

    if (!bot_id || !user_id || !user_name || ((!template_id || !template_category || !template_language_code) && !first_message)) {
      throw new Error('Missing required payload fields');
    }

    // Create chatwoot_channel
    const chatwoot_channel = `Account#${account_id}${account_name}_Inbox#${inbox_id}${inbox_name}`

    // Create Message Id
    const message_id = `${chatwoot_channel}_${user_id}_${message_time.getTime()}`;

    // Create accountData object
    const accountData: Record<string, any> = {};
    if (account_id) accountData.id = account_id
    if (account_name) accountData.name = account_name

    // Create inboxData object
    const inboxData: Record<string, any> = {};
    if (inbox_id) inboxData.id = inbox_id
    if (inbox_name) inboxData.name = inbox_name

    // Create userData object
    const userData: Record<string, any> = {};
    if (user_id) userData.userId = user_id;
    if (user_name) userData.userName = user_name;
    if (user_phone) userData.userPhone = user_phone;
    if (user_email) userData.userEmail = user_email;
    if (user_identifier) userData.userIdentifier = user_identifier;
    if (user_additional_attributes) userData.userAdditionalAttributes = user_additional_attributes;
    if (user_custom_attributes) userData.userCustomAttributes = user_custom_attributes;
    
    // Create firstMessage object
    const firstMessage: Record<string, any> = {};
    if (first_message) {
      const messageData: Record<string, any> = {};
      messageData.content = first_message
      firstMessage.messageData = messageData
    } else {
    const templateData: Record<string, any> = {};
    if (template_id) templateData.id = template_id;
    if (template_category) templateData.category = template_category;
    if (template_language_code) templateData.language_code = template_language_code;
    if (template_variable_2) templateData.variable_2 = template_variable_2;
    if (template_variable_3) templateData.variable_3 = template_variable_3;
    if (template_variable_4) templateData.variable_4 = template_variable_4;
    if (template_variable_5) templateData.variable_5 = template_variable_5;
    if (template_variable_6) templateData.variable_6 = template_variable_6;
    if (template_variable_7) templateData.variable_7 = template_variable_7;
    if (template_variable_8) templateData.variable_8 = template_variable_8;
    firstMessage.templateData = templateData
    }

    // Construct the event
    const event: sdk.IO.IncomingEvent = {
      type: 'text',
      channel: chatwoot_channel,
      direction: 'incoming',
      payload: {
        type: 'text',
        text: `pfm-${secure_string}`,
        timezone: timezone,
        language: language,
        accountData,
        inboxData,
        userData,
        firstMessage
      },
      target: user_id,
      botId: bot_id,
      createdOn: message_time,
      threadId: conversation_id,
      id: message_id,
      preview: `pfm-${secure_string}`,
      hasFlag: () => false,
      setFlag: () => {},
      state: {
        __stacktrace: [],
        user: {
          timezone: timezone,
          language: language
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
          status: 'active'
        }
      },
      suggestions: []
    };

    // Send the event to the Botpress server
    await bp.events.sendEvent(event);
    
    // Log after sending the event to ensure it was sent
    bp.logger.info(`Template received, transformed and sent to Bot: ${bot_id}`);
  } catch (error) {
    bp.logger.error('Error processing outgoing template', error);
  }
};





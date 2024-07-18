import * as sdk from 'botpress/sdk';

export const startNewConversation = async (bp: typeof sdk, payload: any) => {
  try {
    // Set secure_string
    const secure_string = 'e7efaba6b6d6f8cac735031582cd97d5c41431ea9cbc155e333aed7ec05cd62c';

    // Retrieve Account Data
    const account_id = payload.account.id;
    const account_name = payload.account.name.toLowerCase().replace(/\s+/g, '-');

    // Retrieve Inbox Data
    const inbox_id = payload.inbox.id;
    const inbox_name = payload.inbox.name.toLowerCase().replace(/\s+/g, '-');

    if (!account_id || !account_name || !inbox_id || !inbox_name) {
      throw new Error('Missing required account or inbox fields');
    }

    // Create bot_id dynamically
    const bot_id = payload.bot_id;

    // Retrieve User Data
    const user_id = payload.contact.id;
    const user_name = payload.contact.name;
    const user_phone = payload.contact.phone_number;
    const user_email = payload.contact.email;
    const user_identifier = payload.contact.identifier;
    const user_additional_attributes = payload.contact.additional_attributes;
    const user_custom_attributes = payload.contact.custom_attributes;
    
    // Template Variables (Required)
    const message_time = new Date();
    const namespace = payload.template.namespace;
    const template_id = payload.template.id;
    const language_code = payload.template.languageCode;

    // Template Variables (Not-required)
    const variable_2 = payload.template.variable_2;
    const variable_3 = payload.template.variable_3;
    const variable_4 = payload.template.variable_4;
    const variable_5 = payload.template.variable_5;
    const variable_6 = payload.template.variable_6;
    const variable_7 = payload.template.variable_7;
    const variable_8 = payload.template.variable_8;

    // Create chatwoot_channel variable
    const chatwoot_channel = `Account#${account_id}_${account_name}_Inbox#${inbox_id}_${inbox_name}`

    // Create Message Id
    const message_id = `${chatwoot_channel}_${user_id}_${template_id}_${message_time.getTime()}`;

    if (!bot_id || !user_id || !user_name || !namespace || !template_id || !language_code) {
      throw new Error('Missing required payload fields');
    }
    
    // Define the template data as object in event.payload
    const templateData: Record<string, any> = {};
    if (namespace) templateData.namespace = namespace;
    if (template_id) templateData.template_id = template_id;
    if (language_code) templateData.language_code = language_code;
    if (variable_2) templateData.variable_2 = variable_2;
    if (variable_3) templateData.variable_3 = variable_3;
    if (variable_4) templateData.variable_4 = variable_4;
    if (variable_5) templateData.variable_5 = variable_5;
    if (variable_6) templateData.variable_6 = variable_6;
    if (variable_7) templateData.variable_7 = variable_7;
    if (variable_8) templateData.variable_8 = variable_8;

    // Construct the event
    const event: sdk.IO.IncomingEvent = {
      type: 'text',
      channel: chatwoot_channel,
      direction: 'incoming',
      payload: {
        type: 'text',
        text: `snc-${secure_string}`,
        timezone: 2, // Adjust if necessary
        language: 'nl', // Adjust if necessary
        account_id,
        account_name,
        inbox_id,
        inbox_name,
        templateData
      },
      target: user_id,
      botId: bot_id,
      createdOn: message_time,
      threadId: '',
      id: message_id,
      preview: `snc-${secure_string}`,
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
          language: "nl" // Adjust if necessary
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





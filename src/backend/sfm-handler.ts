import * as sdk from 'botpress/sdk';

export const sendFirstMessage = async (bp: typeof sdk, payload: any) => {
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
    const snc_message = payload.message;
    
    // Template Variables
    const template_id = payload.template.id;
    const category = payload.template.category;
    const language_code = payload.template.language_code;
    const variable_2 = payload.template.variable_2;
    const variable_3 = payload.template.variable_3;
    const variable_4 = payload.template.variable_4;
    const variable_5 = payload.template.variable_5;
    const variable_6 = payload.template.variable_6;
    const variable_7 = payload.template.variable_7;
    const variable_8 = payload.template.variable_8;

    if (!bot_id || !user_id || !user_name || (!template_id && !snc_message) {
      throw new Error('Missing required payload fields');
    }

    // Create chatwoot_channel
    const chatwoot_channel = `Account#${account_id}${account_name}_Inbox#${inbox_id}${inbox_name}`

    // Create Message Id
    const message_id = `${chatwoot_channel}_${user_id}_${template_id}_${message_time.getTime()}`;

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
    
    // Define the template data as object in event.payload
    const templateData: Record<string, any> = {};
    if (template_name) templateData.template_name = template_name;
    if (category) templateData.category = category;
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
        text: `sfm-${secure_string}`,
        timezone: 2, // Adjust if necessary
        language: 'nl', // Adjust if necessary
        accountData,
        inboxData,
        userData,
        templateData
      },
      target: user_id,
      botId: bot_id,
      createdOn: message_time,
      threadId: ''  ,
      id: message_id,
      preview: `snc-${secure_string}`,
      hasFlag: () => false,
      setFlag: () => {},
      state: {
        __stacktrace: [],
        user: {
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





import * as sdk from 'botpress/sdk';

export const handleOutgoingTemplate = async (bp: typeof sdk, payload: any) => {
  const medium = payload.medium_variables.medium;
  let botId;
  let agentId;
  let departmentId;

  if (payload.agent.username.startsWith('aiex')) {
    botId = payload.agent.username; // botId is derived from the agent's username
    agentId = payload.agent.username;
    departmentId = payload.agent.department;
  } else {
    botId = `template-sender-${medium}`;
    agentId = payload.agent.username;
    departmentId = payload.agent.department;
  }

  try {
    // Medium Variables (Hardcoded in bot, only required for template-sender)
    const accountId = payload.medium_variables.account_id;
    const accessToken = payload.medium_variables.access_token; 
    const senderId = payload.medium_variables.sender_id; 
    const rocketChatUrl = payload.medium_variables.rocket_chat_url; 
    const applicationId = payload.medium_variables.application_id; 
    const applicationKey = payload.medium_variables.application_key; 

    // Visitor Variables (Required)
    const userId = payload.visitor.userId;
    const userName = payload.visitor.name;
    
    // Template Variables (Required)
    const messageTime = new Date();
    const namespace = payload.template.namespace;
    const templateId = payload.template.id;
    const languageCode = payload.template.languageCode;

    // Template Variables (Not-required)
    const variable_2 = payload.template.variable_2;
    const variable_3 = payload.template.variable_3;
    const variable_4 = payload.template.variable_4;
    const variable_5 = payload.template.variable_5;
    const variable_6 = payload.template.variable_6;
    const variable_7 = payload.template.variable_7;
    const variable_8 = payload.template.variable_8;

    const messageId = `${medium}_${templateId}_${userId}_${messageTime.getTime()}`;

    if (!botId || !medium || !userId || !userName || !namespace || !templateId) {
      throw new Error('Missing required payload fields');
    }

    // Check if the user exists
    const user = await bp.users.getOrCreateUser('rocketchat', userId);

    // Fetch user memory
    const userMemory = await bp.users.getAttributes('rocketchat', userId);

    // Update user memory with medium, userId, and userName if not already set
    if (!userMemory.medium) {
      await bp.users.updateAttributes('rocketchat', userId, { medium });
    }

    if (!userMemory.userId) {
      await bp.users.updateAttributes('rocketchat', userId, { userId });
    }

    if (!userMemory.userName) {
      await bp.users.updateAttributes('rocketchat', userId, { userName });
    }

    // Define the template data as separate objects in temp state
    const templateData: Record<string, any> = {};

    if (agentId) templateData.agentId = agentId;
    if (departmentId) templateData.departmentId = departmentId;
    if (namespace) templateData.namespace = namespace;
    if (templateId) templateData.templateId = templateId;
    if (languageCode) templateData.languageCode = languageCode;
    if (variable_2) templateData.variable_2 = variable_2;
    if (variable_3) templateData.variable_3 = variable_3;
    if (variable_4) templateData.variable_4 = variable_4;
    if (variable_5) templateData.variable_5 = variable_5;
    if (variable_6) templateData.variable_6 = variable_6;
    if (variable_7) templateData.variable_7 = variable_7;
    if (variable_8) templateData.variable_8 = variable_8;


    // Log templateData before constructing the event
    bp.logger.info('templateData to be set:', templateData);

    // Construct the event
    const event: sdk.IO.IncomingEvent = {
      type: 'text',
      channel: 'rocketchat',
      direction: 'incoming',
      payload: {
        type: 'text',
        text: 'template',
        timezone: 2, // Adjust if necessary
        language: 'nl', // Adjust if necessary
        medium: medium,
        accountId: accountId,
        accessToken: accessToken,
        senderId: senderId,
        rocketChatUrl: rocketChatUrl,
        applicationId: applicationId,
        applicationKey: applicationKey,
        templateData: templateData
      },
      target: userId,
      botId: botId,
      createdOn: messageTime,
      threadId: '',
      id: messageId,
      preview: 'template',
      hasFlag: () => false,
      setFlag: () => {},
      state: {
        __stacktrace: [],
        user: {
          medium: medium,
          userId: userId,
          userName: userName,
          timezone: 2, // Adjust if necessary
          language: 'nl' // Adjust if necessary
        },
        context: {},
        session: {
          lastMessages: [],
          workflows: {}
        },
        temp: {},
        bot: {},
        workflow: {
          eventId: messageId,
          status: 'active'
        }
      },
      suggestions: []
    };

    // Log the entire event object for debugging
    bp.logger.info('Constructed event:', JSON.stringify(event, null, 2));

    // Send the event to the Botpress server
    await bp.events.sendEvent(event);
    
    // Log after sending the event to ensure it was sent
    bp.logger.info('Event sent to Botpress server successfully');
  } catch (error) {
    bp.logger.error('Error processing outgoing template', error);
  }
};





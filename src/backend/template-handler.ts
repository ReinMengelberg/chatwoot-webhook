import * as sdk from 'botpress/sdk';

export const handleOutgoingTemplate = async (bp: typeof sdk, payload: any) => {
  let botId;
  let agentId;
  let departmentId;

  if (payload.agent.username.startsWith('aiex')) {
    botId = payload.agent.username; // botId is derived from the agent's username
    agentId = payload.agent.username;
    departmentId = payload.agent.department;
  } else {
    botId = 'template-sender';
    agentId = payload.agent.username;
    departmentId = payload.agent.department;
  }

  try {
    const medium = payload.medium;
    const userId = payload.visitor.userId;
    const userName = payload.visitor.name;
    const messageTime = new Date();

    const namespace = payload.template.namespace;
    const templateId = payload.template.id;
    const languageCode = payload.template.languageCode;

    const variable_2 = payload.template.variable_2;
    const variable_3 = payload.template.variable_3;
    const variable_4 = payload.template.variable_4;
    const variable_5 = payload.template.variable_5;
    const variable_6 = payload.template.variable_6;
    const variable_7 = payload.template.variable_7;
    const variable_8 = payload.template.variable_8;

    // Log temp variables before constructing the event
    bp.logger.info(`Temp variables to be set: 
      agentId=${agentId}, 
      departmentId=${departmentId}, 
      namespace=${namespace}, 
      templateId=${templateId}, 
      languageCode=${languageCode}, 
      variable_2=${variable_2}, 
      variable_3=${variable_3}, 
      variable_4=${variable_4}, 
      variable_5=${variable_5}, 
      variable_6=${variable_6}, 
      variable_7=${variable_7}, 
      variable_8=${variable_8}`);

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

    // Construct the event
    const event: sdk.IO.IncomingEvent = {
      type: 'text',
      channel: 'rocketchat',
      direction: 'incoming',
      payload: {
        type: 'text',
        text: 'template',
        timezone: 2, // Adjust if necessary
        language: 'nl' // Adjust if necessary
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
        temp: {
          agentId: agentId,
          departmentId: departmentId,
          namespace: namespace,
          template: templateId,
          languageCode: languageCode,
          variable_2: variable_2,
          variable_3: variable_3,
          variable_4: variable_4,
          variable_5: variable_5,
          variable_6: variable_6,
          variable_7: variable_7,
          variable_8: variable_8
        },
        bot: {},
        workflow: {
          eventId: messageId,
          status: 'active'
        }
      },
      suggestions: []
    };

    // Send the event to the Botpress server
    await bp.events.sendEvent(event);
  } catch (error) {
    bp.logger.error('Error processing outgoing template', error);
  }
};




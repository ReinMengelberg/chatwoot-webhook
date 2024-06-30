import * as sdk from 'botpress/sdk'

export const handleOutgoingTemplate = async (bp: typeof sdk, payload: any) => {
  if (payload.agent.username.startsWith('aiex')) {
    const botId = payload.agent.username // botId is derived from the agent's username
  } else {
    const botId = 'template-sender'
  }
  
    
  try {
    const medium = payload.medium
    const userId = payload.visitor.userId
    const userName = payload.visitor.name
    const messageTime = new Date().toISOString()

    const namespace = payload.template.namespace
    const templateId = payload.template.id
    const variable_2 = payload.template.variable_2
    const variable_3 = payload.template.variable_3
    const variable_4 = payload.template.variable_4
    const variable_5 = payload.template.variable_5
    const variable_6 = payload.template.variable_6
    const variable_7 = payload.template.variable_7
    const variable_8 = payload.template.variable_8

    const messageId = `${medium}_${templateId}_${userId}_${timestamp}`

    if (!botId || !medium || !userId || !userName || !namespace || !templateId) {
      throw new Error('Missing required payload fields')
    }
    
    // Check if the user exists
    let user = await bp.users.getOrCreateUser('rocketchat', userId)
    
    // Fetch user memory
    const userMemory = await bp.users.getAttributes('rocketchat', userId)

    // Update user memory with userId if not already set
    if (!userMemory.medium) {
      await bp.users.updateAttributes('rocketchat', userId, { medium: medium })
    }
    
    if (!userMemory.userId) {
      await bp.users.updateAttributes('rocketchat', userId, { userId: userId })
    }

    // Update user memory with userName if not already set
    if (!userMemory.userName) {
      await bp.users.updateAttributes('rocketchat', userId, { userName: userName })
    }
    
    // Construct the event
    const event: sdk.IO.IncomingEvent = {
      type: "text",
      channel: "rocketchat",
      direction: "incoming",
      payload: {
        type: "text",
        text: "template",
        timezone: 2, // Adjust if necessary
        language: "nl" // Adjust if necessary
      },
      target: userId,
      botId: botId,
      createdOn: messageTime,
      threadId: "",
      id: messageId,
      preview: "template",
      hasFlag: () => false,
      setFlag: () => {}, 
      state: {
        __stacktrace: [],
        user: {
          medium: medium,
          userId: userId,
          userName: userName,
          timezone: 2, // Adjust if necessary
          language: "nl" // Adjust if necessary
        },
        context: {},
        session: {
          lastMessages: [],
          workflows: {}
        },
        temp: {
          namespace: namespace,
          template: template,
          variable_2: variable_2,
          variable_3: variable_3,
          variable_4: variable_4,
          variable_5: variable_5,
          variable_6: variable_6,
          variable_7: variable_7,
          variable_8: variable_8,
        },
        bot: {},
        workflow: {
          eventId: messageId,
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

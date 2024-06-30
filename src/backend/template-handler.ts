import * as sdk from 'botpress/sdk'

export const handleOutgoingTemplate = async (bp: typeof sdk, payload: any) => {
  if (payload.agent.username.startsWith('aiex')) {
    const botId = payload.agent.username // botId is derived from the agent's username
  } else {
    const botId = 'template-sender'
  }
  
    
  try {
    const userId = payload.visitor.userId
    const userName = payload.visitor.name

    const 

    if (!botId || !userId || !userName || !roomId || !messageText) {
      throw new Error('Missing required payload fields')
    }
    
    // Check if the user exists
    let user = await bp.users.getOrCreateUser('rocketchat', userId)
    
    // Fetch user memory
    const userMemory = await bp.users.getAttributes('rocketchat', userId)

    // Update user memory with userId if not already set
    if (!userMemory.userId) {
      await bp.users.updateAttributes('rocketchat', userId, { userId: userId })
    }

    // Update user memory with userName if not already set
    if (!userMemory.userName) {
      await bp.users.updateAttributes('rocketchat', userId, { userName: userName })
    }

    // Update user memory with userToken if not already set
    if (!userMemory.userToken) {
      await bp.users.updateAttributes('rocketchat', userId, { userToken: userToken })
    }
    
    // Construct the event
    const event: sdk.IO.IncomingEvent = {
      type: "text",
      channel: "rocketchat",
      direction: "incoming",
      payload: {
        type: "text",
        text: messageText,
        timezone: 2, // Adjust if necessary
        language: "nl" // Adjust if necessary
      },
      target: userId,
      botId: botId,
      createdOn: messageTime,
      threadId: roomId,
      id: messageId,
      preview: messageText,
      hasFlag: () => false,
      setFlag: () => {}, 
      state: {
        __stacktrace: [],
        user: {
          userId: userId,
          userName: userName,
          userToken: userToken,
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

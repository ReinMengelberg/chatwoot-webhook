import * as sdk from 'botpress/sdk'

export const handleIncomingMessage = async (bp: typeof sdk, payload: any) => {
  try {
    const botId = payload.agent.username // botId is derived from the agent's username
    const userId = payload.visitor.username
    const userName = payload.visitor.name
    const roomId = payload.messages.rid
    const messageText = payload.messages.msg
    const messageId = payload.messages._id
    const messageTime = payload.createdAt

    if (!botId || !userId || !userName || !roomId || !messageText) {
      throw new Error('Missing required payload fields')
    }
    
    // Check if the user exists
    let user = await bp.users.getOrCreateUser('rocketchat', userId)
    
    // Fetch user memory
    const userMemory = await bp.users.getAttributes('rocketchat', userId)

    // Update user memory with userId if not already set
    if (!userMemory.id) {
      await bp.users.updateAttributes('rocketchat', userId, { userId: userId })
    }

    // Update user memory with userName if not already set
    if (!userMemory.name) {
      await bp.users.updateAttributes('rocketchat', userId, { userName: userName })
    }

    // Create or get the session ID
    const sessionId = bp.dialog.createId({
      botId: botId,
      channel: 'rocketchat',
      target: userId
    })
    
    // Construct the event
    const event: sdk.IO.IncomingEvent = {
      type: 'text',
      channel: 'rocketchat',
      target: userId,
      botId: botId,
      direction: 'incoming',
      payload: {
        text: messageText
      },
      state: {
        user: {
          userId: userId,
          userName: userName
        },
        temp: {},
        session: {
          roomId: roomId,
          lastMessages: [
            {
              eventId: messageId,
              incomingPreview: messageText,
              replySource: 'user',
              replyPreview: messageText,
              timestamp: new Date(messageTime).toISOString()
            }
          ],
          workflows: {}
        },
        bot: {},
        workflow: {
          eventId: messageId,
          status: 'active',
          nodes: [],
          history: [
            {
              eventId: messageId,
              timestamp: new Date(messageTime).toISOString(),
              type: 'incoming'
            }
          ]
        },
        context: {},
        __stacktrace: []
      },
      preview: messageText,
      id: messageId,
      createdOn: new Date(messageTime),
      flags: {},
      hasFlag: () => false,
      setFlag: () => {}
    }

    // Send the event to the Botpress server
    await bp.dialog.processEvent(sessionId, event)
  } catch (error) {
    bp.logger.error('Error processing incoming message', error)
  }
}




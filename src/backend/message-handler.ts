import * as sdk from 'botpress/sdk'

export const handleIncomingMessage = async (bp: typeof sdk, payload: any) => {
  try {
    const botId = payload.agent.username // botId is derived from the agent's username
    const userId = payload.visitor.username
    const userName = payload.visitor.name
    const roomId = payload.messages.rid
    const messageText = payload.messages.msg

    if (!botId || !userId || !userName || !roomId || !messageText) {
      throw new Error('Missing required payload fields')
    }
    
    // Check if the user exists
    let user = await bp.users.getOrCreateUser('rocketchat', userId)
    
    // Fetch user memory
    const userMemory = await bp.users.getAttributes('rocketchat', userId)

    // Update user memory with userId if not already set
    if (!userMemory.id) {
      await bp.users.updateAttributes('rocketchat', userId, { id: userId })
    }

    // Update user memory with userName if not already set
    if (!userMemory.name) {
      await bp.users.updateAttributes('rocketchat', userId, { name: userName })
    }

    // Create or get the session ID
    const sessionId = bp.dialog.createId({
      botId: botId,
      channelId: 'rocketchat',
      target: userId
    })
    
    // Construct the event
    const event = {
      type: 'text',
      channel: 'rocketchat', // Set the communication channel
      target: userId, // User ID
      botId: botId, // Bot ID
      direction: 'incoming',
      payload: {
        text: messageText
      },
      preview: messageText,
    }

    // Send the event to the Botpress server
    await bp.dialog.processEvent(sessionId, event)
  } catch (error) {
    bp.logger.error('Error processing incoming message', error)
  }
}




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
    const userMemory = await bp.users.getUserAttributes('rocketchat', userId)

    // Update user memory with userName if not already set
    if (!userMemory.name) {
      await bp.users.updateUserAttributes('rocketchat', userId, { name: userName })
    }

    // Create or get the session
    let sessionId = await bp.dialog.createOrGetSession(botId, userId)

    // Fetch session memory
    const memory = await bp.dialog.getMemory(sessionId)

    // Update session memory with roomId if not already set
    if (!memory.roomId) {
      await bp.dialog.updateMemory(sessionId, { roomId })
    }

    // Construct the event
    const event: sdk.IO.Event = {
      type: 'text',
      channel: 'rocketchat', // Set the communication channel
      target: userId, // User ID
      botId: botId, // Bot ID
      direction: 'incoming',
      payload: {
        text: messageText
      }
    }

    // Send the event to the Botpress server
    await bp.events.sendEvent(event)
  } catch (error) {
    bp.logger.error('Error processing incoming message', error)
  }
}




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
    let user = await bp.users.getUser('rocketchat', userId)
    if (!user) {
      // Create the user if they don't exist
      user = await bp.users.createUser('rocketchat', userId, {
        first_name: userName,
        last_name: ''
      })
    }

    // Create or get the session
    let session = await bp.dialogEngine.getOrCreateSession(botId, userId)

    // Update session memory with roomId if not already set
    const memory = await bp.dialogEngine.fetchMemory(session)
    if (!memory.roomId) {
      await bp.dialogEngine.updateMemory(botId, userId, { roomId })
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




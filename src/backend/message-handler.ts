import * as sdk from 'botpress/sdk'

export const handleIncomingMessage = async (bp: typeof sdk, payload: any) => {
  try {
    const botId = payload.agent.username // botId is derived from the agent's username
    const roomId = payload._id
    const userId = payload.visitor.username
    const userName = payload.visitor.name

    let medium = "undefined"
    if (botId.includes("email")) {
      medium = "email"
    } else if (botId.includes("whatsapp")) {
      medium = "whatsapp"
    } else if (botId.includes("instagram")) {
      medium = "instagram"
    } else if (botId.includes("messenger")) {
      medium = "messenger"
    } else if (botId.includes("linkedin")) {
      medium = "linkedin"
    }

    // Ensure messages is an array and access the first message
    if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
      throw new Error('Messages array is missing or empty')
    }

    const message = payload.messages[0]
    const messageText = message.msg
    const messageId = message._id
    const messageTime = message.ts

    if (!botId || !userId || !userName || !roomId || !messageText) {
      throw new Error('Missing required payload fields')
    }

    // Check if the user exists
    let user = await bp.users.getOrCreateUser('rocketchat', userId)

    // Fetch user memory
    const userMemory = await bp.users.getAttributes('rocketchat', userId)

    // Update user memory with medium if not already set
    if (!userMemory.medium) {
      await bp.users.updateAttributes('rocketchat', userId, { medium: medium })
    }

    // Update user memory with userId if not already set
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
          medium: medium,
          userId: userId,
          userName: userName,
          timezone: 2, // Adjust if necessary
          language: "nl", // Adjust if necessary
          medium: medium
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





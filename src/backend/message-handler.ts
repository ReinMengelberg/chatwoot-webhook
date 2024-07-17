import * as sdk from 'botpress/sdk'

export const handleIncomingMessage = async (bp: typeof sdk, payload: any) => {
  try {
    const inbox = payload.inbox.name;
    const parts = inbox.split(" - ");
    let account: string, channel: string;

    if (parts.length === 2) {
        account = parts[0].trim().toLowerCase().replace(/\s+/g, '-');
        channel = parts[1].trim().toLowerCase().replace(/\s+/g, '-');
    } else {
        logger.error("Inbox format is incorrect. Expected format: 'string1 - string2'");
        return; // Exit the function if the format is incorrect
    }

    const botId = `aiex-${account}-${channel}`;
    const roomId = payload._id;
    const userId = payload.visitor.username;
    const userName = payload.visitor.name;

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
    if (!userMemory.channel) {
      await bp.users.updateAttributes( channel, userId, { channel: channel })
    }

    // Update user memory with userId if not already set
    if (!userMemory.userId) {
      await bp.users.updateAttributes( channel, userId, { userId: userId })
    }

    // Update user memory with userName if not already set
    if (!userMemory.userName) {
      await bp.users.updateAttributes( channel, userId, { userName: userName })
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
        language: "nl", // Adjust if necessary
        medium: medium
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
          channel: channel,
          userId: userId,
          userName: userName,
          timezone: 2, // Adjust if necessary
          language: "nl", // Adjust if necessary
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





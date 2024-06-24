import * as sdk from 'botpress/sdk'
import { handleIncomingMessage } from './message-handler'

export const setupWebhookEndpoint = (bp: typeof sdk) => {
  const router = bp.http.createRouterForBot('botpress-rocketchat-webhook', { checkAuthentication: false })

  router.post('/webhook', async (ctx) => {
    try {
      const { messages, agent, visitor } = ctx.request.body

      if (!messages || !agent || !visitor) {
        ctx.status = 400
        ctx.body = 'messages, agent, and visitor are required'
        return
      }

      if (!agent.username.startsWith('aiex')) {
        ctx.status = 200
        ctx.body = 'Agent username does not match criteria, ignoring message'
        return
      }

      await handleIncomingMessage(bp, ctx.request.body)
      ctx.status = 200
      ctx.body = 'Payload processed'
    } catch (error) {
      bp.logger.error('Error handling webhook', error)
      ctx.status = 500
      ctx.body = 'Internal Server Error'
    }
  })
}




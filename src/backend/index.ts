import * as sdk from 'botpress/sdk'
import { setupMessageEndpoint } from './message-endpoint'
import { setupSfmEndpoint } from './sfm-endpoint'

// This is called when the server is started, usually to set up the database
const onServerStarted = async (bp: typeof sdk) => {}

// At this point, you would likely set up the API route of your module.
const onServerReady = async (bp: typeof sdk) => {
  // Setup the message endpoint asynchronously without blocking
  setupMessageEndpoint(bp)
  // Setup the Send First Message endpoint asynchronously without blocking
  setupSfmEndpoint(bp)
}

// Every time a bot is created (or enabled), this method will be called with the bot id
const onBotMount = async (bp: typeof sdk, botId: string) => {}

// This is called every time a bot is deleted (or disabled)
const onBotUnmount = async (bp: typeof sdk, botId: string) => {}

// When anything is changed using the flow editor, this is called with the new flow, so you can rename nodes if you reference them
const onFlowChanged = async (bp: typeof sdk, botId: string, flow: sdk.Flow) => {}

/**
 * This is where you would include your 'demo-bot' definitions.
 * You can copy the content of any existing bot and mark them as "templates", so you can create multiple bots from the same template.
 */
const botTemplates: sdk.BotTemplate[] = [{ id: 'my_bot_demo', name: 'Bot Demo', desc: 'Some description' }]

/**
 * Skills allows you to create custom logic and use them easily on the flow editor
 * Check this link for more information: https://botpress.com/docs/building-chatbots/developers/custom-modules#skills
 */
const skills: sdk.Skill[] = []

const entryPoint: sdk.ModuleEntryPoint = {
  onServerStarted,
  onServerReady,
  onBotMount,
  onBotUnmount,
  onFlowChanged,
  botTemplates,
  skills,
  definition: {
    // This must match the name of your module's folder, and the name in package.json
    name: 'chatwoot-webhook',
    /**
     * By default we are using the https://blueprintjs.com/docs/#icons. Use the corresponding name
     * Otherwise, create an icon in the assets module in the following format studio_${module.menuIcon}
     */
    menuIcon: 'flag',
    // This is the name of your module which will be displayed in the sidebar
    menuText: 'Complete Module',
    // When set to `true`, the name and icon of your module won't be displayed in the sidebar
    noInterface: false,
    // The full name is used in other places, for example when displaying bot templates
    fullName: 'Complete Module',
    // Not used anywhere, but should be a link to your website or module repository
    homepage: 'https://github.com/ReinMengelberg/rocketchat-webhook/'
  }
}

export default entryPoint



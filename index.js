const dotenv = require('dotenv');
const restify = require('restify');
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
  UserState,
  ShowTypingMiddleware
} = require('botbuilder');
const { DialogAndWelcomeBot } = require('./bots/dialogAndWelcomeBot');
const { JobProfileDialog } = require('./dialogs/jobProfileDialog');

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
}).use(new ShowTypingMiddleware(0, 550));

adapter.onTurnError = async (context, error) => {
  console.log('onTurnError', error);
  await context.sendActivity('Oops, something went wrong');
};

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

const dialog = new JobProfileDialog(userState);
const bot = new DialogAndWelcomeBot(conversationState, userState, dialog);

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`${ server.name } listening to ${ server.url }`);
});

server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await bot.run(context);
  });
});

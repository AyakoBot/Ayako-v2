import commands from './requestHandler/commands.js';
import channels from './requestHandler/channels.js';
import guilds from './requestHandler/guilds.js';
import webhooks from './requestHandler/webhooks.js';
import invites from './requestHandler/invites.js';
import stageInstances from './requestHandler/stageInstances.js';
import stickers from './requestHandler/stickers.js';
import threads from './requestHandler/threads.js';
import users from './requestHandler/users.js';
import voice from './requestHandler/voice.js';

const self = {
 reload: async () => {
  self.file = await import(`../../../../UtilModules/requestHandler.js?version=${Date.now()}`);
 },
 file: await import(`../../../../UtilModules/requestHandler.js`),

 commands,
 channels,
 guilds,
 webhooks,
 invites,
 stageInstances,
 stickers,
 threads,
 users,
 voice,
};

export default self;

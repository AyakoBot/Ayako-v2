import Jobs from 'node-schedule';
import client from '../../../BaseClient/Bot/Client.js';

import cache from './startupTasks/cache.js';
import customAPIsHandler from './startupTasks/customAPIsHandler.js';
import customBotCommands from './startupTasks/customBotCommands.js';
import separators from './startupTasks/separators.js';

import antivirusBlocklistCacher from './timedFiles/antivirusBlocklistCacher.js';
import nitroHandler from './timedFiles/nitroHandler.js';
import timedManager from './timedFiles/timedManager.js';
import verification from './timedFiles/verification.js';
import websiteFetcher from './timedFiles/websiteFetcher.js';

export default async () => {
 await customAPIsHandler();
 customBotCommands();

 antivirusBlocklistCacher();
 nitroHandler();
 separators();

 Jobs.scheduleJob(new Date(Date.now() + 5000), () => {
  cache();

  Jobs.scheduleJob(new Date(Date.now() + 60000), () => {
   if (client.user?.id === client.util.mainID) {
    client.util.cache.fishFish.start();
    client.util.cache.sinkingYachts.start();
    client.util.cache.urlTLDs.start();
   }
  });
 });

 Jobs.scheduleJob('0 0 0 * * *', async () => {
  nitroHandler();
  animekosInviteStats();
  rpToggleUses();
  client.util.cache.fishFish.start();
  client.util.cache.sinkingYachts.start();
  client.util.cache.urlTLDs.start();
 });

 Jobs.scheduleJob('0 * * * * *', async () => verification());
 Jobs.scheduleJob('0 */30 * * *', async () => antivirusBlocklistCacher());
 Jobs.scheduleJob('*/2 * * * * *', async () => timedManager());

 if (client.user?.id !== client.util.mainID) return;
 if (client.cluster?.mode !== 'process') return;
 Jobs.scheduleJob('*/1 */1 */1 * *', async () => websiteFetcher());
};

const rpToggleUses = () =>
 client.util.DataBase.guildsettings
  .updateMany({
   where: { rpenableruns: { not: 0 } },
   data: { rpenableruns: 0 },
  })
  .then();

const animekosInviteStats = async () => {
 const guild = client.guilds.cache.get('298954459172700181');
 if (!guild) return;

 const invites = await client.util.getAllInvites(guild);
 if (!invites) return;

 const inviteTxt = client.util.txtFileWriter(
  `${invites
   .map((i) => (Number(i.uses) > 9 ? `${i.code} ${i.uses}` : null))
   .filter((i): i is string => !!i)
   .join('\n')}\n${guild.memberCount}`,
 );
 if (!inviteTxt) return;

 client.util.send({ id: '958483683856228382', guildId: guild.id }, { files: [inviteTxt] });
};

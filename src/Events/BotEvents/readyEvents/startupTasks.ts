import Jobs from 'node-schedule';
import client from '../../../BaseClient/Bot/Client.js';
import getPathFromError from '../../../BaseClient/UtilModules/getPathFromError.js';

import cache from './startupTasks/cache.js';
import customBotCommands from './startupTasks/customBotCommands.js';
import separators from './startupTasks/separators.js';

import amQuarantineControl from './timedFiles/amQuarantineControl.js';
import antivirusBlocklistCacher from './timedFiles/antivirusBlocklistCacher.js';
import nitroHandler from './timedFiles/nitroHandler.js';
import timedManager from './timedFiles/timedManager.js';
import verification from './timedFiles/verification.js';
import guilds from './timedFiles/guilds.js';
import users from './timedFiles/users.js';
import voiceLevels from './timedFiles/voiceLevels.js';

export default async () => {
 await customBotCommands();

 await antivirusBlocklistCacher();
 amQuarantineControl();
 await nitroHandler();
 await separators();

 Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 5000), () => {
  cache();

  Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 60000), () => {
   if (client.user?.id === process.env.ownerId) {
    client.util.cache.fishFish.start();
    client.util.cache.sinkingYachts.start();
    client.util.cache.urlTLDs.start();
   }
  });
 });

 Jobs.scheduleJob(getPathFromError(new Error()), '0 0 23 * * *', () => {
  nitroHandler();
  animekosInviteStats();
  rpToggleUses();
  client.util.cache.fishFish.start();
  client.util.cache.sinkingYachts.start();
  client.util.cache.urlTLDs.start();
 });

 Jobs.scheduleJob(getPathFromError(new Error()), '0 * * * * *', () => {
  verification();
  voiceLevels();
 });

 Jobs.scheduleJob(getPathFromError(new Error()), '0 */30 * * *', () => {
  antivirusBlocklistCacher();
  guilds();
  amQuarantineControl();
 });

 Jobs.scheduleJob(getPathFromError(new Error()), '*/2 * * * * *', () => timedManager());

 Jobs.scheduleJob(getPathFromError(new Error()), '0 0 22 * * *', () => {
  users();
 });
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

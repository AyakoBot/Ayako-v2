import Jobs from 'node-schedule';
import client from '../../../BaseClient/Bot/Client.js';

export default async () => {
 await client.util.importCache.Events.BotEvents.readyEvents.startupTasks.customAPIsHandler.file.default();
 client.util.importCache.Events.BotEvents.readyEvents.startupTasks.customBotCommands.file.default();
 client.util.importCache.Events.BotEvents.readyEvents.startupTasks.separators.file.default();

 client.util.importCache.Events.BotEvents.readyEvents.timedFiles.antivirusBlocklistCacher.file.default();
 client.util.importCache.Events.BotEvents.readyEvents.timedFiles.nitroHandler.file.default();

 Jobs.scheduleJob(new Date(Date.now() + 5000), () => {
  client.util.importCache.Events.BotEvents.readyEvents.startupTasks.cache.file.default();

  Jobs.scheduleJob(new Date(Date.now() + 60000), () => {
   if (client.user?.id === process.env.mainID) {
    client.util.cache.fishFish.start();
    client.util.cache.sinkingYachts.start();
    client.util.cache.urlTLDs.start();
   }
  });
 });

 Jobs.scheduleJob('0 0 0 * * *', async () => {
  client.util.importCache.Events.BotEvents.readyEvents.timedFiles.nitroHandler.file.default();
  animekosInviteStats();
  rpToggleUses();
  client.util.cache.fishFish.start();
  client.util.cache.sinkingYachts.start();
  client.util.cache.urlTLDs.start();
 });

 Jobs.scheduleJob('0 * * * * *', async () =>
  client.util.importCache.Events.BotEvents.readyEvents.timedFiles.verification.file.default(),
 );
 Jobs.scheduleJob('0 */30 * * *', async () =>
  client.util.importCache.Events.BotEvents.readyEvents.timedFiles.antivirusBlocklistCacher.file.default(),
 );
 Jobs.scheduleJob('*/2 * * * * *', async () =>
  client.util.importCache.Events.BotEvents.readyEvents.timedFiles.timedManager.file.default(),
 );

 if (client.user?.id !== process.env.mainID) return;
 if (client.cluster?.mode !== 'process') return;
 Jobs.scheduleJob('*/1 */1 */1 * *', async () =>
  client.util.importCache.Events.BotEvents.readyEvents.timedFiles.websiteFetcher.file.default(),
 );
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

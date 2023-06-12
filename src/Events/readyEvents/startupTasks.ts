import Jobs from 'node-schedule';
import * as ch from '../../BaseClient/ClientHelper.js';
import client from '../../BaseClient/Client.js';

import willisDiabloCounter from './startupTasks/willisDiabloCounter.js';
import cache from './startupTasks/cache.js';
import slashCommandInitializer from './startupTasks/slashCommandInitializer.js';
import voteHandler from './startupTasks/voteHandler.js';
import appealHandler from './startupTasks/appealHandler.js';

import antivirusBlocklistCacher from './timedFiles/antivirusBlocklistCacher.js';
import websiteFetcher from './timedFiles/websiteFetcher.js';
import verification from './timedFiles/verification.js';
import presence from './timedFiles/presence.js';
import timedManager from './timedFiles/timedManager.js';

export default async () => {
 voteHandler();
 appealHandler();
 willisDiabloCounter();
 cache();
 slashCommandInitializer();
 antivirusBlocklistCacher();

 Jobs.scheduleJob('0 0 0 * * *', async () => {
  animekosInviteStats();
  rpToggleUses();
 });

 Jobs.scheduleJob('0 * * * * *', async () => {
  presence();
  verification();
 });

 Jobs.scheduleJob('0 */30 * * *', async () => antivirusBlocklistCacher());
 Jobs.scheduleJob('*/2 * * * * *', async () => timedManager());

 if (client.user?.id !== ch.mainID) return;
 Jobs.scheduleJob('*/1 */1 */1 * *', async () => websiteFetcher());
};

const rpToggleUses = async () =>
 ch.query(`UPDATE guildsettings SET rpenableruns = 0 WHERE rpenableruns != 0;`);

const animekosInviteStats = async () => {
 const guild = client.guilds.cache.get('298954459172700181');
 if (!guild) return;

 const invites = await guild.invites.fetch();
 if (!invites) return;

 const inviteTxt = ch.txtFileWriter(
  `${invites
   .map((i) => (Number(i.uses) > 9 ? `${i.code} ${i.uses}` : null))
   .filter((i): i is string => !!i)}\n${guild.memberCount}`,
 );
 if (!inviteTxt) return;

 ch.send({ id: '958483683856228382', guildId: guild.id }, { files: [inviteTxt] });
};

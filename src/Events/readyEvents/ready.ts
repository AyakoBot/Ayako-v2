import * as Jobs from 'node-schedule';
import client from '../../BaseClient/Client.js';

export default async () => {
  // eslint-disable-next-line no-console
  console.log(
    `| Logged in\n| => Bot: ${client.user?.username}#${client.user?.discriminator} / ${
      client.user?.id
    }\n| Login at ${new Date(Date.now()).toLocaleString()}`,
  );

  Jobs.scheduleJob('*/10 * * * *', () => {
    // eslint-disable-next-line no-console
    console.log(`=> Current Date: ${new Date().toLocaleString()}`);
  });

  (await import('./startupTasks/cache.js')).default();

  if (client.mainID !== client.user?.id) return;
  // (await import('./startupTasks')).default();
  Jobs.scheduleJob('0 0 0 */1 * *', async () => {
    const guild = client.guilds.cache.get('298954459172700181');
    if (!guild) return;

    const invites = await guild.invites.fetch();
    if (!invites) return;

    const inviteTxt = client.ch.txtFileWriter(
      invites
        .map((i) => (Number(i.uses) > 9 ? `${i.code} ${i.uses}` : null))
        .filter((i): i is string => !!i),
    );
    if (!inviteTxt) return;

    client.ch.send(
      { id: '958483683856228382', guildId: guild.id },
      { files: [inviteTxt] },
      await client.ch.languageSelector(guild.id),
    );
  });
};

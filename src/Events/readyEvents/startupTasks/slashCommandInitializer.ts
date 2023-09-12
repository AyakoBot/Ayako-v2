import commands from './SlashCommands.js';
import client from '../../../BaseClient/Client.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async () => {
 if (client.shard?.mode !== 'process') return;

 const createCommands = Object.values(commands.public);
 await client.application?.commands.set(createCommands);
 await client.application?.commands.fetch();

 const guilds = await ch.DataBase.guildsettings.findMany({ where: { token: { not: null } } });
 guilds.forEach(async (g) => {
  const guild = client.guilds.cache.get(g.guildid);
  if (!guild) return;

  await ch.request.commands.bulkOverwriteGlobalCommands(
   guild,
   ch.getBotIdFromToken(g.token as string),
   createCommands.map((c) => c.toJSON()),
  );

  await ch.request.commands.getGlobalCommands(guild, ch.getBotIdFromToken(g.token as string));
 });
};

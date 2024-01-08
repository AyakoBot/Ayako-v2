import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async () => {
 client.util.request.commands.getGlobalCommands(undefined, client as Discord.Client<true>);

 client.guilds.cache.forEach(async (g) => {
  const settings = await client.util.DataBase.guildsettings.findUnique({
   where: { guildid: g.id, token: { not: null } },
  });
  if (!settings?.token) return;

  await client.util.request.commands.getGlobalCommands(g, client as Discord.Client<true>);
 });
};

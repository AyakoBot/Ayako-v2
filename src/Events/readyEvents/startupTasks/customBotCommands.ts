import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async () => {
 ch.request.commands.getGlobalCommands(undefined, client as Discord.Client<true>);

 client.guilds.cache.forEach(async (g) => {
  const settings = await ch.DataBase.guildsettings.findUnique({
   where: { guildid: g.id, token: { not: null } },
  });
  if (!settings?.token) return;

  await ch.request.commands.getGlobalCommands(g, client as Discord.Client<true>);
 });
};

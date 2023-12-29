import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async () => {
 ch.request.commands.getGlobalCommands(undefined, client as Discord.Client<true>);

 client.guilds.cache.forEach((g) => {
  const globalCommands = async () => {
   const commands = await ch.request.commands.getGlobalCommands(g, client as Discord.Client<true>);

   if ('message' in commands) {
    ch.error(g, new Error(commands.message));
    return;
   }

   commands.forEach((c) => ch.cache.commands.set(g.id, c.id, c));
  };

  const guildCommands = async () => {
   const commands = await ch.request.commands.getGuildCommands(g);

   if ('message' in commands) {
    ch.error(g, new Error(commands.message));
    return;
   }

   commands.forEach((c) => ch.cache.commands.set(g.id, c.id, c));
  };

  globalCommands();
  guildCommands();
 });
};

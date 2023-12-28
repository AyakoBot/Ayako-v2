import client from '../../../BaseClient/Client.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import commands from './SlashCommands.js';

export default async () => {
 if (client.shard?.mode !== 'process') return;
 if (!process.argv.includes('--put-commands')) return;

 const createCommands = Object.values(commands.public);
 await client.application?.commands.set(createCommands);
 await client.application?.commands.fetch();

 mainBotCommands(createCommands);
 customBotCommands(createCommands);
};

type ValueOf<T> = T[keyof T];

const mainBotCommands = async (createCommands: ValueOf<(typeof commands)['public']>[]) =>
 (await ch.DataBase.guildsettings.findMany({ where: { token: { not: null } } })).forEach((g) => {
  const guild = client.guilds.cache.get(g.guildid);
  if (!guild) return;

  ch.request.commands.bulkOverwriteGlobalCommands(
   guild,
   createCommands.map((c) => c.toJSON()),
  );
 });

const customBotCommands = async (createCommands: ValueOf<(typeof commands)['public']>[]) =>
 (
  await ch.DataBase.guildsettings.findMany({
   where: {
    token: { not: null },
   },
  })
 ).forEach(async (s) => {
  if (!s.token) return;

  const guild = client.guilds.cache.get(s.guildid);
  if (!guild) return;

  const globalCommands = async () => {
   if (!s.token) return;

   const cmds = await ch.request.commands.bulkOverwriteGlobalCommands(
    guild,
    createCommands.map((c) => c.toJSON()),
   );

   if ('message' in cmds) {
    ch.error(guild, new Error(cmds.message));
    return;
   }

   cmds.forEach((c) => ch.cache.commands.set(guild.id, c.id, c));
  };

  const guildCommands = async () => {
   if (!s.token) return;

   const cmds = await ch.request.commands.bulkOverwriteGuildCommands(
    guild,
    createCommands.map((c) => c.toJSON()),
   );

   if ('message' in cmds) {
    ch.error(guild, new Error(cmds.message));
    return;
   }

   cmds.forEach((c) => ch.cache.commands.set(guild.id, c.id, c));
  };

  globalCommands();
  guildCommands();
 });

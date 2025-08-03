import * as Discord from 'discord.js';
import rp from '../../SlashCommands/rp/manager.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 await cmd.deferUpdate();
 cmd.editReply({
  components: [],
  embeds: [
   {
    ...cmd.client.util.loadingEmbed({
     language,
     lan: { author: language.slashCommands.rp.author },
    }),
    fields: [
     {
      name: language.slashCommands.rp.pleaseWait,
      value: language.slashCommands.rp.field,
      inline: false,
     },
    ],
   },
  ],
 });

 const settings = !(await cmd.client.util.DataBase.guildsettings
  .findUnique({
   where: { guildid: cmd.guildId },
   select: { enabledrp: true },
  })
  .then((r) => r?.enabledrp));

 cmd.client.util.DataBase.guildsettings
  .upsert({
   where: { guildid: cmd.guildId },
   create: { guildid: cmd.guildId, enabledrp: settings },
   update: { enabledrp: settings },
  })
  .then();

 if (!settings) {
  await deleteAll(cmd);
  deleteMain(cmd);
 } else await create(cmd.guild);

 rp(cmd, [], true);
};

const deleteAll = async (cmd: Discord.ButtonInteraction<'cached'>) => {
 const commands = await cmd.guild.client.util.request.commands.getGuildCommands(cmd.guild);
 if ('message' in commands) {
  cmd.guild.client.util.error(cmd.guild, new Error(commands.message));
  return;
 }

 if (commands.length === cmd.client.util.constants.commands.interactions.length) {
  await cmd.client.util.request.commands.bulkOverwriteGuildCommands(cmd.guild, []);
 } else {
  const commandNames = cmd.client.util.constants.commands.interactions.map((c) => c.name);

  await Promise.all(
   commands
    .filter((c) => commandNames.includes(c.name))
    .map((c) => cmd.guild.client.util.request.commands.deleteGuildCommand(cmd.guild, c.id)),
  );
 }
};

export const create = async (guild: Discord.Guild) => {
 const commands = await guild.client.util.request.commands.getGuildCommands(guild);

 if ('message' in commands) {
  guild.client.util.error(guild, new Error(commands.message));
  return;
 }

 const registerCommands = getRegisterCommands(
  guild.client.util.constants.commands.interactions,
 ).filter((c) => !commands.find((existing) => existing.name === c.name));

 const createPayload = registerCommands.map((c) => c.toJSON());

 if (!commands.length) {
  await guild.client.util.request.commands.bulkOverwriteGuildCommands(guild, createPayload);
 } else {
  guild.client.util.cache.interactionInstallmentRunningFor.add(guild.id);
  await Promise.all(
   createPayload.map((p) => guild.client.util.request.commands.createGuildCommand(guild, p)),
  );
  guild.client.util.cache.interactionInstallmentRunningFor.delete(guild.id);
 }

 await guild.client.util.DataBase.guildsettings.upsert({
  where: { guildid: guild.id },
  update: { rpenableruns: { increment: 1 } },
  create: { guildid: guild.id, rpenableruns: 1, enabledrp: true },
 });
};

export const getRegisterCommands = (
 interactions: Discord.Client<true>['util']['constants']['commands']['interactions'],
) =>
 interactions.map((c) => {
  const command = new Discord.SlashCommandBuilder().setName(c.name).setDescription(c.desc);

  if (c.users) {
   command.addUserOption(
    new Discord.SlashCommandUserOption()
     .setDescription('The User to interact with')
     .setRequired(c.reqUser)
     .setName('user'),
   );
  }

  command.addStringOption(
   new Discord.SlashCommandStringOption()
    .setName('text')
    .setDescription('The text to Display')
    .setRequired(false),
  );

  if ('specialOptions' in c && c.specialOptions) {
   c.specialOptions.forEach((o) =>
    command.addStringOption(
     new Discord.SlashCommandStringOption()
      .setName(o.name)
      .setDescription(o.desc)
      .setRequired(false),
    ),
   );
  }

  if (c.users) {
   new Array(5).fill(null).forEach((_, i) => {
    command.addUserOption(
     new Discord.SlashCommandUserOption()
      .setDescription(`Another User to interact with`)
      .setRequired(false)
      .setName(`user-${i}`),
    );
   });
  }

  return command;
 });

const deleteMain = async (cmd: Discord.ButtonInteraction<'cached'>) => {
 const API = await import('../../../BaseClient/Bot/Client.js').then((m) => m.API);

 const cc = await cmd.client.util.DataBase.customclients.findUnique({
  where: { guildid: cmd.guildId, token: { not: null } },
 });
 if (!cc) return;

 const commands = await API.applicationCommands
  .getGuildCommands(cmd.client.user.id, cmd.guildId)
  .catch(() => null);
 if (!commands) return;

 if (commands.length === cmd.client.util.constants.commands.interactions.length) {
  await API.applicationCommands.bulkOverwriteGuildCommands(cmd.client.user.id, cmd.guildId, []);
 } else {
  const commandNames = cmd.client.util.constants.commands.interactions.map((c) => c.name);

  await Promise.all(
   commands
    .filter((c) => commandNames.includes(c.name))
    .map((c) => API.applicationCommands.deleteGuildCommand(cmd.client.user.id, cmd.guildId, c.id)),
  );
 }
};

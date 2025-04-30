import {
 SlashCommandBuilder,
 SlashCommandStringOption,
 SlashCommandUserOption,
} from '@discordjs/builders';
import { type APIGuild, type APIMessageComponentInteraction } from 'discord-api-types/v10.js';
import util from 'src/BaseClient/Bot/Util.js';
import constants from '../../../BaseClient/Other/constants.js';
import rp from '../../SlashCommands/rp/manager.js';
import { request } from 'src/BaseClient/UtilModules/requestHandler.js';

export default async (cmd: APIMessageComponentInteraction) => {
 if (!cmd.guild) return;

 const language = await util.getLanguage(cmd.guild_id);

 await request.interactions.deferMessageUpdate(cmd.id, cmd.token);
 request.interactions.editReply(cmd.application_id, cmd.token, {
  components: [],
  embeds: [
   {
    ...util.loadingEmbed({
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

 const settings = !(await util.DataBase.guildsettings
  .findUnique({ where: { guildid: cmd.guild_id }, select: { enabledrp: true } })
  .then((r) => r?.enabledrp));

 util.DataBase.guildsettings
  .upsert({
   where: { guildid: cmd.guild_id },
   create: { guildid: cmd.guild_id!, enabledrp: settings },
   update: { enabledrp: settings },
  })
  .then();

 if (!settings) await deleteAll(cmd);
 else await create(cmd.guild);

 rp(cmd, [], true);
};

const deleteAll = async (cmd: APIMessageComponentInteraction) => {
 const commands = await util.request.commands.getGuildCommands(cmd.guild);
 if ('message' in commands) {
  util.error(cmd.guild, new Error(commands.message));
  return;
 }

 if (commands.length === util.constants.commands.interactions.length) {
  await util.request.commands.bulkOverwriteGuildCommands(cmd.guild, []);
 } else {
  const commandNames = util.constants.commands.interactions.map((c) => c.name);

  await Promise.all(
   commands
    .filter((c) => commandNames.includes(c.name))
    .map((c) => util.request.commands.deleteGuildCommand(cmd.guild, c.id)),
  );
 }
};

export const create = async (guild: APIGuild) => {
 const commands = await util.request.commands.getGuildCommands(guild);

 if ('message' in commands) {
  util.error(guild, new Error(commands.message));
  return;
 }

 const registerCommands = getRegisterCommands(util.constants.commands.interactions).filter(
  (c) => !commands.find((existing) => existing.name === c.name),
 );

 const createPayload = registerCommands.map((c) => c.toJSON());

 if (!commands.length) {
  await util.request.commands.bulkOverwriteGuildCommands(guild, createPayload);
 } else {
  util.cache.interactionInstallmentRunningFor.add(guild.id);
  await Promise.all(createPayload.map((p) => util.request.commands.createGuildCommand(guild, p)));
  util.cache.interactionInstallmentRunningFor.delete(guild.id);
 }

 await util.DataBase.guildsettings.upsert({
  where: { guildid: guild.id },
  update: { rpenableruns: { increment: 1 } },
  create: { guildid: guild.id, rpenableruns: 1, enabledrp: true },
 });
};

export const getRegisterCommands = (interactions: (typeof constants)['commands']['interactions']) =>
 interactions.map((c) => {
  const command = new SlashCommandBuilder().setName(c.name).setDescription(c.desc);

  if (c.users) {
   command.addUserOption(
    new SlashCommandUserOption()
     .setDescription('The User to interact with')
     .setRequired(c.reqUser)
     .setName('user'),
   );
  }

  command.addStringOption(
   new SlashCommandStringOption()
    .setName('text')
    .setDescription('The text to Display')
    .setRequired(false),
  );

  if ('specialOptions' in c && c.specialOptions) {
   c.specialOptions.forEach((o) =>
    command.addStringOption(
     new SlashCommandStringOption().setName(o.name).setDescription(o.desc).setRequired(false),
    ),
   );
  }

  if (c.users) {
   new Array(5).fill(null).forEach((_, i) => {
    command.addUserOption(
     new SlashCommandUserOption()
      .setDescription(`Another User to interact with`)
      .setRequired(false)
      .setName(`user-${i}`),
    );
   });
  }

  return command;
 });

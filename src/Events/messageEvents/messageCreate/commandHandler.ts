import * as stringSimilarity from 'string-similarity';
import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import { glob } from 'glob';
import client from '../../../BaseClient/Client.js';
import auth from '../../../auth.json' assert { type: 'json' };
import * as CT from '../../../Typings/CustomTypings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async (msg: Discord.Message) => {
 if (!msg.content) return;

 if (!msg.inGuild()) dmCommand(msg);
 else guildCommand(msg);
};

const dmCommand = async (msg: Discord.Message) => {
 const { prefix } = ch.constants.standard;
 const args = msg.content
  .slice(prefix.length)
  .trim()
  .split(/\s+|\n+/g);

 const commandName = args.shift()?.toLowerCase() as string;
 const command = await getComand(commandName);
 if (!command) return;
 if (!command.dmAllowed) return;

 const language = await ch.getLanguage(msg.author.id);
 command.default(msg, args, { language, command, prefix });
};

const guildCommand = async (msg: Discord.Message<true>) => {
 const prefix = await getPrefix(msg);
 if (!prefix) return;

 const args = msg.content
  .slice(prefix.length)
  .trim()
  .split(/\s+|\n+/g);

 const commandName = args.shift()?.toLowerCase();
 if (!commandName) return;

 const command = await getComand(commandName);
 if (!command) {
  const allSlashCommands = (await glob(`${process.cwd()}/Commands/SlashCommands/**/*`))
   .filter((f) => f.endsWith('.js') && !f.endsWith('.map.js'))
   .map((f) =>
    f
     .replace(`${process.cwd()}/Commands/SlashCommands/`, '')
     .replace('.js', '')
     .replace(/\/.*/g, ''),
   );

  const matchingName = stringSimilarity.findBestMatch(commandName, allSlashCommands).bestMatch
   .target;

  const slashCommand = await getSlashCommand(msg.guild, matchingName);
  if (!slashCommand) return;

  const canUse = checkCommandPermissions(msg, commandName);
  if (!canUse) {
   const reaction = await ch.request.channels.addReaction(
    msg,
    ch.constants.standard.getEmoteIdentifier(ch.emotes.cross),
   );

   if (typeof reaction !== 'undefined') ch.error(msg.guild, new Error(reaction.message));
   return;
  }

  const language = await ch.getLanguage(msg.author.id);
  const matchingCommands = ch.constants.standard.getCommand(slashCommand);
  if (!matchingCommands.length) return;

  const embed: Discord.APIEmbed = {
   description: language.slashCommands.useSlashCommands(
    matchingCommands.length > 1 ? `\n${matchingCommands.join('\n')}` : matchingCommands.join('\n'),
   ),
   color: ch.constants.colors.ephemeral,
  };

  const reply = await ch.replyMsg(msg, {
   embeds: [embed],
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.Button,
       emoji: ch.emotes.crossWithBackground,
       style: Discord.ButtonStyle.Secondary,
       custom_id: 'dismiss',
      },
     ],
    },
   ],
  });
  if (!reply) return;

  Jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
   if (reply && (await ch.isDeleteable(reply))) ch.request.channels.deleteMessage(reply);
  });
  return;
 }

 if (command.thisGuildOnly?.length && command.thisGuildOnly?.includes(msg.guildId)) return;
 if (command.type === 'owner' && msg.author.id !== auth.ownerID) return;
 if (command.dmOnly) return;

 const language = await ch.getLanguage(msg.guildId);

 const commandIsEnabled = await checkCommandIsEnabled(msg, commandName, command);
 if (!commandIsEnabled) {
  const reaction = await ch.request.channels.addReaction(
   msg,
   ch.constants.standard.getEmoteIdentifier(ch.emotes.cross),
  );

  if (typeof reaction !== 'undefined') ch.error(msg.guild, new Error(reaction.message));
  return;
 }

 const canRunCommand = checkCommandPermissions(msg, commandName);
 if (!canRunCommand) {
  const m = await ch.errorMsg(msg, language.permissions.error.you, language);
  Jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
   if (!m) return;
   if (m && (await ch.isDeleteable(m))) ch.request.channels.deleteMessage(m);
   if (await ch.isDeleteable(msg)) ch.request.channels.deleteMessage(msg);
  });
  return;
 }

 if (command.takesFirstArg && !args.length) {
  const reaction = await ch.request.channels.addReaction(
   msg,
   ch.constants.standard.getEmoteIdentifier(ch.emotes.cross),
  );

  if (typeof reaction !== 'undefined') ch.error(msg.guild, new Error(reaction.message));
  return;
 }

 if (
  ch.cache.cooldown.get(msg.channelId)?.has(commandName) ||
  ch.cache.cooldown
   .get(msg.channelId)
   ?.has(
    ch.constants.commands.interactions.find((c) => c.name === commandName) ? 'interactions' : '',
   )
 ) {
  ch.request.channels.addReaction(msg, '⌛');
  return;
 }

 command.default(msg, args, { language, command, prefix });
};

export const getPrefix = async (msg: Discord.Message) => {
 if (!msg.inGuild()) return ch.constants.standard.prefix;

 const customPrefix = await ch.DataBase.guildsettings
  .findUnique({
   where: {
    guildid: msg.guildId,
   },
  })
  .then((r) => r?.prefix);

 if (customPrefix && msg.content.toLowerCase().startsWith(customPrefix?.toLowerCase())) {
  return customPrefix;
 }

 if (msg.content.toLowerCase().startsWith(ch.constants.standard.prefix)) {
  return ch.constants.standard.prefix;
 }

 return undefined;
};

const getComand = async (commandName: string) => {
 const files = await glob(`${process.cwd()}/Commands/StringCommands/**/*`);

 const path = files.find((f) => f.endsWith(`/${commandName}.js`));
 if (!path) return undefined;

 log(commandName);

 return (await import(path)) as CT.Command<boolean>;
};

const getSlashCommand = (guild: Discord.Guild, commandName: string) =>
 ch.getCustomCommand(guild, commandName as Parameters<typeof ch.getCustomCommand>[1]);

export const checkCommandPermissions = (
 msg: {
  guildId: string;
  guild: Discord.Guild;
  author: Discord.User;
  channelId: string;
  member: Discord.GuildMember | null;
 },
 commandName: string,
) => {
 const slashCommand =
  ch.cache.commands.get(msg.guildId)?.find((c) => c.name === commandName) ??
  client.application?.commands.cache.find((c) => c.name === commandName) ??
  msg.guild.commands.cache.find((c) => c.name === commandName);

 if (!slashCommand) return true;

 const commandPerms = ch.cache.commandPermissions.cache.get(msg.guildId)?.get(slashCommand.id);
 if (
  !commandPerms?.length &&
  (!slashCommand.defaultMemberPermissions ||
   msg.member?.permissions.has(slashCommand.defaultMemberPermissions.toArray()))
 ) {
  return true;
 }

 if (!commandPerms?.length) return false;

 const userPermission = commandPerms.find(
  (p) => p.type === Discord.ApplicationCommandPermissionType.User && p.id === msg.author.id,
 );

 if (userPermission) return userPermission.permission;

 const channelPermissions = commandPerms.filter(
  (p) => p.type === Discord.ApplicationCommandPermissionType.Channel,
 );
 const channelPermission = channelPermissions.find((p) => p.id === msg.channelId);
 const allChannelPermission = channelPermissions.find((p) => p.id === msg.guildId);

 if (channelPermission && !channelPermission.permission) return false;
 if (allChannelPermission && allChannelPermission.permission && !channelPermission?.permission) {
  return false;
 }

 const rolePermissions = commandPerms.filter(
  (p) => p.type === Discord.ApplicationCommandPermissionType.Role,
 );
 const everyonePermission = rolePermissions.find((p) => p.id === msg.guildId);
 const rolePermission = rolePermissions.filter((p) => msg.member?.roles.cache.has(p.id));

 if (everyonePermission && !everyonePermission.permission) return false;
 if (
  rolePermission.length &&
  !rolePermission.find((r) => !!r.permission) &&
  !everyonePermission?.permission
 ) {
  return false;
 }

 return true;
};

const checkCommandIsEnabled = async (
 msg: Discord.Message<true>,
 commandName: string,
 command: CT.Command<boolean>,
) => {
 const slashCommand =
  ch.cache.commands.get(msg.guildId)?.find((c) => c.name === commandName) ??
  client.application?.commands.cache.find((c) => c.name === commandName) ??
  msg.guild.commands.cache.find((c) => c.name === commandName);

 if (!slashCommand && command.requiresSlashCommand) return false;
 return true;
};

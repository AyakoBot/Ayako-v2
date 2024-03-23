import * as Discord from 'discord.js';
import { glob } from 'glob';
import * as Jobs from 'node-schedule';
import * as stringSimilarity from 'string-similarity';
import * as CT from '../../../../Typings/Typings.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';

const { log } = console;

export default async (msg: Discord.Message) => {
 if (!msg.content) return;

 if (!msg.inGuild()) dmCommand(msg);
 else guildCommand(msg);
};

const dmCommand = async (msg: Discord.Message) => {
 const { prefix } = msg.client.util.constants.standard;
 const args = msg.content
  .slice(prefix.length)
  .trim()
  .split(/\s+|\n+/g);

 const commandName = args.shift()?.toLowerCase() as string;
 const command = await getComand(commandName);
 if (!command) return;
 if (!command.dmAllowed) return;

 const language = await msg.client.util.getLanguage(msg.author.id);
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
  const allSlashCommands = (
   await glob(
    `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/SlashCommands/**/*`,
   )
  )
   .filter((f) => f.endsWith('.js') && !f.endsWith('.map.js'))
   .map((f) =>
    f
     .replace(
      `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/SlashCommands/`,
      '',
     )
     .replace('.js', '')
     .replace(/\/.*/g, ''),
   );

  const matchingName = stringSimilarity.findBestMatch(commandName, allSlashCommands).bestMatch
   .target;

  const slashCommand = await getSlashCommand(msg.guild, matchingName);
  if (!slashCommand) return;

  const language = await msg.client.util.getLanguage(msg.author.id);
  const matchingCommands = msg.client.util.constants.standard.getCommand(slashCommand);
  if (!matchingCommands.length) return;

  const embed: Discord.APIEmbed = {
   description: language.slashCommands.useSlashCommands(
    matchingCommands.length > 1 ? `\n${matchingCommands.join('\n')}` : matchingCommands.join('\n'),
   ),
   color: CT.Colors.Ephemeral,
  };

  const reply = await msg.client.util.replyMsg(msg, {
   embeds: [embed],
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.Button,
       emoji: msg.client.util.emotes.crossWithBackground,
       style: Discord.ButtonStyle.Secondary,
       custom_id: 'dismiss',
      },
     ],
    },
   ],
  });
  if (!reply) return;

  Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), async () => {
   if (reply && (await msg.client.util.isDeleteable(reply))) {
    msg.client.util.request.channels.deleteMessage(reply);
   }
  });
  return;
 }

 if (command.thisGuildOnly?.length && command.thisGuildOnly?.includes(msg.guildId)) return;
 if (command.type === 'owner' && msg.author.id !== process.env.ownerID) return;
 if (command.dmOnly) return;

 const language = await msg.client.util.getLanguage(msg.guildId);

 const commandIsEnabled = await checkCommandIsEnabled(msg, commandName, command);
 if (!commandIsEnabled) {
  const reaction = await msg.client.util.request.channels.addReaction(
   msg,
   msg.client.util.constants.standard.getEmoteIdentifier(msg.client.util.emotes.cross),
  );

  if (typeof reaction !== 'undefined') {
   msg.client.util.error(msg.guild, new Error(reaction.message));
  }
  return;
 }

 const canRunCommand = await checkCommandPermissions(msg, commandName);
 if (!canRunCommand.can) {
  const m = await msg.client.util.errorMsg(msg, language.permissions.error.you, language);
  Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), async () => {
   if (!m) return;
   if (m && (await msg.client.util.isDeleteable(m))) {
    msg.client.util.request.channels.deleteMessage(m);
   }
   if (await msg.client.util.isDeleteable(msg)) msg.client.util.request.channels.deleteMessage(msg);
  });
  return;
 }

 if (command.takesFirstArg && !args.length) {
  const reaction = await msg.client.util.request.channels.addReaction(
   msg,
   msg.client.util.constants.standard.getEmoteIdentifier(msg.client.util.emotes.cross),
  );

  if (typeof reaction !== 'undefined') {
   msg.client.util.error(msg.guild, new Error(reaction.message));
  }
  return;
 }

 if (
  msg.client.util.cache.cooldown.get(msg.channelId)?.has(commandName) ||
  msg.client.util.cache.cooldown
   .get(msg.channelId)
   ?.has(
    msg.client.util.constants.commands.interactions.find((c) => c.name === commandName)
     ? 'interactions'
     : '',
   )
 ) {
  msg.client.util.request.channels.addReaction(msg, '⌛');
  return;
 }

 command.default(msg, args, { language, command, prefix });
};

export const getPrefix = async (msg: Discord.Message) => {
 if (!msg.inGuild()) return msg.client.util.constants.standard.prefix;

 const customPrefix = await msg.client.util.DataBase.guildsettings
  .findUnique({
   where: {
    guildid: msg.guildId,
   },
  })
  .then((r) => r?.prefix);

 if (customPrefix && msg.content.toLowerCase().startsWith(customPrefix?.toLowerCase())) {
  return customPrefix;
 }

 if (msg.content.toLowerCase().startsWith(msg.client.util.constants.standard.prefix)) {
  return msg.client.util.constants.standard.prefix;
 }

 return undefined;
};

const getComand = async (commandName: string) => {
 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/StringCommands/**/*`,
 );

 const path = files.find((f) => f.endsWith(`/${commandName}.js`));
 if (!path) return undefined;

 log(commandName);

 return (await import(path)) as CT.Command<boolean>;
};

const getSlashCommand = (guild: Discord.Guild, commandName: string) =>
 guild.client.util.getCustomCommand(
  guild,
  commandName as Parameters<typeof guild.client.util.getCustomCommand>[1],
 );

export const checkCommandPermissions = async (
 message: {
  guildId: string;
  guild: Discord.Guild;
  author: Discord.User;
  channelId: string;
  member: Discord.GuildMember | null;
 },
 commandName: string,
): Promise<{ can: boolean; debugNum: number }> => {
 const slashCommand =
  [...(message.guild.client.util.cache.commands.cache.get(message.guildId)?.values() ?? [])].find(
   (c) => c.name.replace(/-/g, '') === commandName,
  ) ??
  message.guild.client.application?.commands.cache.find(
   (c) => c.name.replace(/-/g, '') === commandName,
  ) ??
  message.guild.commands.cache.find((c) => c.name.replace(/-/g, '') === commandName);

 if (!slashCommand) return { can: true, debugNum: 1 };

 const existingGuildPerms = message.guild.client.util.cache.commandPermissions.cache.get(
  message.guildId,
 );
 if (!existingGuildPerms) {
  await message.guild.client.util.request.commands.getGuildCommandsPermissions(message.guild);
 }

 const guildPerms = message.guild.client.util.cache.commandPermissions.cache.get(message.guildId);
 if (
  !guildPerms &&
  slashCommand.defaultMemberPermissions &&
  message.member?.permissions.has(slashCommand.defaultMemberPermissions)
 ) {
  return { can: true, debugNum: 13 };
 }
 if (!guildPerms) return { can: false, debugNum: 4 };

 const commandPerms = guildPerms.get(slashCommand.id);
 if (
  !commandPerms?.length &&
  (!slashCommand.defaultMemberPermissions ||
   slashCommand.defaultMemberPermissions.toArray().find((p) => message.member?.permissions.has(p)))
 ) {
  return { can: true, debugNum: 2 };
 }

 if (!commandPerms?.length) return { can: false, debugNum: 5 };

 const userPermission = commandPerms.find(
  (p) => p.type === Discord.ApplicationCommandPermissionType.User && p.id === message.author.id,
 );
 if (userPermission) return { can: userPermission.permission, debugNum: 11 };

 const channelPermissions = commandPerms.filter(
  (p) => p.type === Discord.ApplicationCommandPermissionType.Channel,
 );
 const channelPermission = channelPermissions.find((p) => p.id === message.channelId);
 const allChannelPermission = channelPermissions.find((p) => p.id === message.guildId);

 if (channelPermission && !channelPermission.permission) return { can: false, debugNum: 6 };
 if (allChannelPermission && allChannelPermission.permission && !channelPermission?.permission) {
  return { can: false, debugNum: 7 };
 }

 const rolePermissions = commandPerms.filter(
  (p) => p.type === Discord.ApplicationCommandPermissionType.Role,
 );
 const everyonePermission = rolePermissions.find((p) => p.id === message.guildId);
 const rolePermission = rolePermissions.filter((p) => message.member?.roles.cache.has(p.id));

 if (rolePermission.find((p) => p.permission)) return { can: true, debugNum: 9 };
 if (rolePermission.find((p) => !p.permission)) return { can: false, debugNum: 14 };

 if (
  !everyonePermission &&
  slashCommand.defaultMemberPermissions &&
  !slashCommand.defaultMemberPermissions.toArray().find((p) => message.member?.permissions.has(p))
 ) {
  return { can: false, debugNum: 12 };
 }
 if (everyonePermission && !everyonePermission.permission) {
  return { can: false, debugNum: 8 };
 }

 return { can: true, debugNum: 10 };
};

const checkCommandIsEnabled = async (
 msg: Discord.Message<true>,
 commandName: string,
 command: CT.Command<boolean>,
) => {
 const slashCommand =
  [...(msg.client.util.cache.commands.cache.get(msg.guildId)?.values() ?? [])].find(
   (c) => c.name.replace(/-+/g, '') === commandName,
  ) ??
  msg.client.application?.commands.cache.find((c) => c.name.replace(/-+/g, '') === commandName) ??
  msg.guild.commands.cache.find((c) => c.name.replace(/-+/g, '') === commandName);

 if (!slashCommand && command.requiresSlashCommand) return false;
 return true;
};

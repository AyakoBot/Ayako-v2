import * as Discord from 'discord.js';
import glob from 'glob';
import client from '../../../BaseClient/Client.js';
import auth from '../../../auth.json' assert { type: 'json' };
import * as DBT from '../../../Typings/DataBaseTypings';
import type * as CT from '../../../Typings/CustomTypings';
import languageSelector from '../../../BaseClient/ClientHelperModules/languageSelector.js';
import constants from '../../../BaseClient/Other/constants.js';
import errorMsg from '../../../BaseClient/ClientHelperModules/errorMsg.js';
import replyMsg from '../../../BaseClient/ClientHelperModules/replyMsg.js';
import objectEmotes from '../../../BaseClient/ClientHelperModules/objectEmotes.js';
import query from '../../../BaseClient/ClientHelperModules/query.js';

export default async (msg: Discord.Message) => {
 if (!msg.content) return;

 if (!msg.inGuild()) dmCommand(msg);
 else guildCommand(msg);
};

const dmCommand = async (msg: Discord.Message) => {
 const { prefix } = constants.standard;
 const args = msg.content
  .slice(prefix.length)
  .trim()
  .split(/(\s|\n)+/g);

 const command = await getComand(args.shift()?.toLowerCase() as string);
 if (!command) return;
 if (!command.dmAllowed) return;

 const language = await languageSelector(msg.author.id);
 command.default(msg, args, { language, command, prefix });
};

const guildCommand = async (msg: Discord.Message<true>) => {
 const prefix = await getPrefix(msg);
 if (!prefix) return;

 const args = msg.content
  .slice(prefix.length)
  .trim()
  .split(/(\s|\n)+/g);

 const commandName = args.shift()?.toLowerCase();
 if (!commandName) return;

 const command = await getComand(commandName);
 if (!command) return;

 if (command.thisGuildOnly?.length && command.thisGuildOnly?.includes(msg.guildId)) return;
 if (command.type === 'owner' && msg.author.id !== auth.ownerID) return;
 if (command.dmOnly) return;

 const language = await languageSelector(msg.guildId);
 const canRunCommand = await checkCommandPermissions(msg, commandName);
 if (!canRunCommand) {
  errorMsg(msg, language.permissions.error.you, language);
  return;
 }

 if (command.takesFirstArg && !args.length) {
  const lan = language.commands.noArgs;

  replyMsg(msg, {
   content: lan.content,
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.Button,
       label: lan.button,
       customId: `help/commands_${commandName}`,
       style: Discord.ButtonStyle.Success,
       emoji: objectEmotes.question,
      },
     ],
    },
   ],
  });
  return;
 }

 command.default(msg, args, { language, command, prefix });
};

export const getPrefix = async (msg: Discord.Message) => {
 if (!msg.inGuild()) return constants.standard.prefix;

 const customPrefix = await query(`SELECT prefix FROM guildsettings WHERE guildid = $1;`, [
  msg.guildId,
 ]).then((res: DBT.guildsettings[] | null) => res?.[0]?.prefix);

 if (customPrefix && msg.content.toLowerCase().startsWith(customPrefix?.toLowerCase())) {
  return customPrefix;
 }

 if (msg.content.toLowerCase().startsWith(constants.standard.prefix)) {
  return constants.standard.prefix;
 }

 return undefined;
};

const getComand = async (commandName: string) => {
 const files: string[] = await new Promise((resolve) => {
  glob(`${process.cwd()}/Commands/StringCommands/**/*`, (err, res) => {
   if (err) throw err;
   resolve(res);
  });
 });

 // eslint-disable-next-line no-console
 console.log(commandName);

 const path = files.find((f) => f.endsWith(`/${commandName}.js`));
 if (!path) return undefined;

 return (await import(path)) as CT.Command;
};

const checkCommandPermissions = async (msg: Discord.Message<true>, commandName: string) => {
 const slashCommand =
  client.application?.commands.cache.find((c) => c.name === commandName) ??
  msg.guild.commands.cache.find((c) => c.name === commandName);
 if (!slashCommand) return true;
 const perms = await client.application?.commands.permissions.fetch({
  guild: msg.guild,
 });

 if (!perms?.size) return true;
 const commandPerms = perms.get(slashCommand.id);
 if (!commandPerms) return true;

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
 if (allChannelPermission && !allChannelPermission.permission && !channelPermission?.permission) {
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

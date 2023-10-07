import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import Commands from '../../../Events/readyEvents/startupTasks/SlashCommands.js';
import permissions from '../../SlashCommands/mod/permissions.js';

type CommandType =
 | 'ban'
 | 'strike'
 | 'channel-ban'
 | 'kick'
 | 'soft-ban'
 | 'temp-ban'
 | 'temp-channel-ban'
 | 'tempmute'
 | 'unban'
 | 'unmute'
 | 'warn';

export default async (cmd: Discord.ButtonInteraction, args: CommandType[]) => {
 if (!cmd.inCachedGuild()) return;

 const response = await cmd.deferReply({ ephemeral: true });
 cmd.editReply({
  components: cmd.message.components.map((actionRow) => ({
   type: actionRow.type,
   components: actionRow.components.map((c) => ({
    ...c.data,
    disabled: true,
   })),
  })),
  message: cmd.message,
 });

 const name = args.shift();
 if (!name) {
  ch.error(cmd.guild, new Error('No name provided'));
  return;
 }

 const command = cmd.guild.commands.cache.find((c) => c.name === name);
 if (command) {
  await ch.request.commands.deleteGuildCommand(cmd.guild, command.id);
  permissions(cmd, [], response);
  return;
 }

 const submitCmdData = registerCmd(name, cmd.guild);
 if (!submitCmdData) {
  ch.error(cmd.guild, new Error("Couldn't register Command"));
  return;
 }

 ch.request.commands.createGuildCommand(cmd.guild, submitCmdData);
 permissions(cmd, [], response);
};

export const registerCmd = (commandName: CommandType, guild: Discord.Guild) => {
 const mainCmd = Commands.public.mod.toJSON();
 const cmdData = mainCmd.options?.find((o) => o.name === commandName);
 if (!cmdData) {
  ch.error(guild, new Error('Command-Option not found'));
  return undefined;
 }

 const submitCmd = new Discord.SlashCommandBuilder()
  .setName(cmdData.name)
  .setDescription(cmdData.description)
  .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
  .setDMPermission(false);

 if (cmdData.name_localizations) submitCmd.setNameLocalizations(cmdData.name_localizations);

 if (cmdData.description_localizations) {
  submitCmd.setDescriptionLocalizations(cmdData.description_localizations);
 }

 const submitCmdData = submitCmd.toJSON();

 if (
  [
   Discord.ApplicationCommandOptionType.Subcommand,
   Discord.ApplicationCommandOptionType.SubcommandGroup,
  ].includes(cmdData.type) &&
  'options' in cmdData &&
  cmdData.options
 ) {
  submitCmdData.options = cmdData.options;
 }

 return submitCmdData;
};

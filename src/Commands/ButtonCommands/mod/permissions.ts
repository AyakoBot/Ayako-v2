import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import Commands from '../../../SlashCommands/index.js';
import * as CT from '../../../Typings/Typings.js';
import permissions from '../../SlashCommands/mod/permissions.js';

type CommandType = keyof CT.Language['slashCommands']['moderation']['permissions']['buttons'];

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

 const name = args.shift() as CommandType;
 if (!name) {
  ch.error(cmd.guild, new Error('No name provided'));
  return;
 }

 const command = await ch.getCustomCommand(cmd.guild, name);

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

 await ch.request.commands.createGuildCommand(cmd.guild, submitCmdData);
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

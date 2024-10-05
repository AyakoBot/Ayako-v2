import * as Discord from 'discord.js';
import interactions from '../../BaseClient/Other/constants/interactions.js';
import { getRegisterCommands } from '../../Commands/ButtonCommands/rp/toggle.js';
import getChunks from '../../BaseClient/UtilModules/getChunks.js';

const commands = getRegisterCommands(interactions);
const commandChunks = getChunks(commands, 25);

const actions = new Array(commandChunks.length)
 .fill(null)
 .map((_, i) =>
  new Discord.SlashCommandBuilder()
   .setName(`actions-${i}`)
   .setDescription('RP-Actions')
   .setContexts([
    Discord.InteractionContextType.Guild,
    Discord.InteractionContextType.PrivateChannel,
   ])
   .setIntegrationTypes([Discord.ApplicationIntegrationType.UserInstall]),
 );

const setOptions = (
 subcommand: Discord.SlashCommandSubcommandBuilder,
 options: Discord.ToAPIApplicationCommandOptions[],
) => {
 options.forEach((opt) => {
  const o = opt.toJSON();

  switch (o.type) {
   case Discord.ApplicationCommandOptionType.String:
    subcommand.addStringOption(
     new Discord.SlashCommandStringOption()
      .setName(o.name)
      .setNameLocalizations(o.name_localizations ?? {})
      .setDescription(o.description)
      .setDescriptionLocalizations(o.description_localizations ?? {}),
    );
    break;
   case Discord.ApplicationCommandOptionType.User:
    subcommand.addUserOption(
     new Discord.SlashCommandUserOption()
      .setName(o.name)
      .setNameLocalizations(o.name_localizations ?? {})
      .setDescription(o.description)
      .setDescriptionLocalizations(o.description_localizations ?? {})
      .setRequired(o.required || false),
    );
    break;
   default:
    break;
  }
 });
};

commandChunks.forEach((chunk, i) => {
 chunk.forEach((c) => {
  actions[i].addSubcommand((subcommand) => {
   subcommand
    .setName(c.name)
    .setNameLocalizations(c.name_localizations ?? {})
    .setDescription(c.description)
    .setDescriptionLocalizations(c.description_localizations ?? {});

   setOptions(subcommand, c.options);

   return subcommand;
  });
 });
});

export default actions;

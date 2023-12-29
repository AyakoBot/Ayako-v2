import * as Discord from 'discord.js';
import SlashCommands from '../../SlashCommands/index.js';
import * as CT from '../../Typings/Typings.js';
import getLanguage from './getLanguage.js';
import getEmbeds from './helpHelpers/getEmbeds.js';
import replyCmd from './replyCmd.js';

/**
 * Helper function to generate a message payload for a slash command
 * or string select menu interaction.
 * @param cmd - The slash command or string select menu interaction.
 * @param type - The command category type.
 * @returns A message payload containing embeds and components for the interaction.
 */
export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.StringSelectMenuInteraction,
 type: CT.CommandCategories,
 selected?: string,
) => {
 const rawCommands = Object.entries(SlashCommands.categories)
  .filter(([, val]) => val === type)
  .map(([k]) => k);
 const commandArgs = rawCommands.map((k) => k.split(/_/g));
 const allCommands = commandArgs
  .map((k) => {
   if (k.length === 3) {
    return {
     parentCommand: k.at(0) as string,
     subCommandGroup: k.at(1) as string,
     subCommand: k.at(2) as string,
    };
   }
   if (k.length === 2) return { parentCommand: k.at(0) as string, subCommand: k.at(1) as string };
   return { parentCommand: k.at(0) as string };
  })
  .filter((c) => !!c);

 const categories = [...new Set(allCommands.map((c) => c.parentCommand))];

 const commands =
  categories.length === 1
   ? allCommands
   : allCommands.filter((c) =>
      selected && selected !== 'other' ? c.parentCommand === selected : !c.subCommand,
     );

 const commandsWithSubCommandsOrSubCommandGroups = commands.filter(
  (c) => c.subCommand || c.subCommandGroup,
 );
 const parentCommands = commandsWithSubCommandsOrSubCommandGroups.map((c) => c.parentCommand);
 const uniqueParentCommands = [...new Set(parentCommands)].filter((s): s is string => !!s);

 const subCommandGroupsWithSubCommands = commandsWithSubCommandsOrSubCommandGroups.filter(
  (c) => c.subCommandGroup && c.subCommand,
 );
 const uniqueSubCommandGroupsWithSubCommands = subCommandGroupsWithSubCommands.filter(
  (value, index, self) =>
   index ===
   self.findIndex(
    (t) => t.parentCommand === value.parentCommand && t.subCommandGroup === value.subCommandGroup,
   ),
 );

 const language = await getLanguage(cmd.guildId);

 const payload: CT.UsualMessagePayload = {
  embeds: getEmbeds(
   cmd,
   language,
   commands,
   uniqueParentCommands,
   uniqueSubCommandGroupsWithSubCommands,
   type,
  ),
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      custom_id: `help/viewCommand_${type}`,
      placeholder: language.slashCommands.help.selectCommand,
      disabled: categories.length === 1,
      options:
       categories.length === 1
        ? [{ label: '-', value: '-' }]
        : allCommands
           .map((c) => ({
            parent: c.subCommand ? c.parentCommand : undefined,
            sub: c.subCommand ?? c.parentCommand,
           }))
           .reverse()
           .filter(
            (c, i, arr) =>
             arr.findIndex(
              (t) => t.parent === c.parent || t.sub === c.sub || t.sub === c.parent,
             ) === i,
           )
           .map((c) => ({
            label: (c.parent || language.t.Other) as string,
            value: c.parent || 'other',
            default: c.parent === selected || (!selected && !c.parent),
           }))
           .sort((a) => (a.value === 'other' ? -1 : 1)),
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      custom_id: 'help/select',
      placeholder: language.slashCommands.help.selectPlaceholder,
      options: [...new Set(Object.values(SlashCommands.categories))].map((c) => ({
       label: language.slashCommands.help.categories[c as CT.CommandCategories],
       value: c,
       default: c === type,
      })),
     },
    ],
   },
  ],
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction) {
  replyCmd(cmd, payload);
 } else cmd.update(payload);
};

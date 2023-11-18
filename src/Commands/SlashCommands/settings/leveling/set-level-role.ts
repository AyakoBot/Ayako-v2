import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { getComponents } from './set-level-user.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: string[],
 r: Discord.Role,
) => {
 if (!cmd.inCachedGuild()) return;

 const role = cmd instanceof Discord.ButtonInteraction ? r : cmd.options.getRole('role', true);
 const language = await ch.getLanguage(cmd.guildId);

 const components = ch.getChunks(getComponents(role.id, 0, 0, language, 'role'), 5);
 const excluded = getExcludedButton(language, role);
 const embed = getEmbed(language, role, 0, 0, []);

 ch.replyCmd(cmd, {
  components: [
   { type: Discord.ComponentType.ActionRow, components: components[0] },
   { type: Discord.ComponentType.ActionRow, components: components[1] },
   { type: Discord.ComponentType.ActionRow, components: components[2] },
   { type: Discord.ComponentType.ActionRow, components: [excluded] },
  ],
  embeds: [embed],
 });
};

export const getExcludedButton = (
 language: CT.Language,
 role: Discord.Role,
): Discord.APISelectMenuComponent => ({
 type: Discord.ComponentType.RoleSelect,
 custom_id: `set-level/excluded_${role.id}`,
 placeholder: language.slashCommands.setLevel.excluded,
 min_values: 0,
 max_values: 25,
});

export const getEmbed = (
 language: CT.Language,
 role: Discord.Role,
 newXP: number,
 newLevel: number,
 roles: string[],
) => ({
 author: {
  name: language.autotypes.leveling,
 },
 description: language.slashCommands.setLevel.descRole(role),
 color: ch.constants.colors.ephemeral,
 fields: [
  {
   name: language.slashCommands.setLevel.newXP,
   value: ch.splitByThousand(newXP),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.newLvl,
   value: ch.splitByThousand(newLevel),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.excluded,
   value: roles.length ? roles.map((r) => `<@&${r}>`).join(', ') : language.t.None,
   inline: false,
  },
 ],
});

import * as Discord from 'discord.js';
import { findField, getComponents } from '../../StringSelect/roles/button-roles.js';

export default async (
 cmd: Discord.RoleSelectMenuInteraction,
 args: string[],
 type: 'button-roles' | 'reaction-roles' = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const emoji = args.join('_');
 const embed = JSON.parse(JSON.stringify(cmd.message.embeds[0].data)) as Discord.APIEmbed;
 const field = findField(emoji, embed.fields);

 if (field) field.value = cmd.roles.map((r) => `<@&${r.id}>`).join(', ');

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.builders;

 cmd.update({
  embeds: [embed],
  components: getComponents(
   emoji,
   lan,
   language,
   cmd.roles.map((r) => r.id),
   type,
  ),
 });
};

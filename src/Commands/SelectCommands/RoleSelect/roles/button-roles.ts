import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import { getComponents, findField } from '../../StringSelect/roles/button-roles.js';

export default async (cmd: Discord.RoleSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const embed = JSON.parse(JSON.stringify(cmd.message.embeds[0].data)) as Discord.APIEmbed;
 const field = findField(args[0], embed.fields);

 if (field) field.value = cmd.roles.map((r) => `<@&${r.id}>`).join(', ');

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.roles.builders;

 cmd.update({
  embeds: [embed],
  components: getComponents(
   args[0],
   lan,
   language,
   cmd.roles.map((r) => r.id),
  ),
 });
};

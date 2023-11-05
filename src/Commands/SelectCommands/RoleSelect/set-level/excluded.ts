import * as Discord from 'discord.js';
import { getEmbed } from '../../../SlashCommands/settings/leveling/set-level-role.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.RoleSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const role = cmd.guild.roles.cache.get(args.shift() as string);
 if (!role) {
  ch.errorCmd(cmd, language.errors.roleNotFound, language);
  return;
 }

 const xp = Number(cmd.message.embeds[0].fields[0].value.replace(/,/g, ''));
 const level = Number(cmd.message.embeds[0].fields[1].value.replace(/,/g, ''));
 const embed = getEmbed(language, role, xp, level, cmd.values);

 cmd.update({ embeds: [embed] });
};

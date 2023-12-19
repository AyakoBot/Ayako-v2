import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import selfRoles from '../../../SlashCommands/self-roles.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const removeRoles = cmd.values.filter((r) => cmd.member.roles.cache.has(r));
 const giveRoles = cmd.values.filter((r) => !cmd.member.roles.cache.has(r));
 const language = await ch.getLanguage(cmd.guildId);

 if (removeRoles.length) {
  await ch.request.guilds.editMember(
   cmd.member,
   {
    roles: cmd.member.roles.cache.map((r) => r.id).filter((r) => !removeRoles.includes(r)),
   },
   language.autotypes.selfroles,
  );
 }

 if (giveRoles.length) {
  await ch.request.guilds.editMember(
   cmd.member,
   {
    roles: [...giveRoles, ...cmd.member.roles.cache.map((r) => r.id)],
   },
   language.autotypes.selfroles,
  );
 }

 selfRoles(cmd, args);
};

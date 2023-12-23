import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import rolesContinue from '../../../SlashCommands/emojis/edit/roles.js';

export default async (cmd: Discord.RoleSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const emoji = cmd.guild?.emojis.cache.get(args.shift() as string);
 const roles = cmd.roles.map((r) => r.id) ?? [];
 const alreadyExistingRoles = emoji?.roles.cache.map((r) => r.id) ?? [];

 const addRoles = roles.filter((r) => !alreadyExistingRoles.includes(r));
 const removeRoles = alreadyExistingRoles.filter((r) => !roles.includes(r));

 const newEmoji = emoji
  ? await ch.request.guilds.editEmoji(cmd.guild, emoji.id, {
     roles: [...new Set([...addRoles, ...removeRoles])],
    })
  : undefined;

 if (newEmoji && 'message' in newEmoji) {
  ch.errorCmd(cmd, newEmoji, await ch.getLanguage(cmd.guildId));
  return;
 }

 rolesContinue(cmd, newEmoji);
};

import type * as Discord from 'discord.js';
import rolesContinue from '../../../SlashCommands/emojis/edit/roles.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import { GuildEmoji } from '../../../../BaseClient/Other/classes.js';

export default async (cmd: Discord.RoleSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const emoji = cmd.guild?.emojis.cache.get(args.shift() as string);
 const roles = cmd.roles.map((r) => r.id) ?? [];
 const alreadyExistingRoles = emoji?.roles.cache.map((r) => r.id) ?? [];

 const addRoles = roles.filter((r) => !alreadyExistingRoles.includes(r));
 const removeRoles = alreadyExistingRoles.filter((r) => !roles.includes(r));

 const updateRes = emoji
  ? await ch.request.guilds.editEmoji(cmd.guild, emoji.id, {
     roles: [...new Set([...addRoles, ...removeRoles])],
    })
  : undefined;

 if (updateRes && 'message' in updateRes) {
  ch.errorCmd(cmd, updateRes.message, await ch.languageSelector(cmd.guildId));
  return;
 }

 const newEmoji = updateRes ? new GuildEmoji(cmd.client, updateRes, cmd.guild) : updateRes;

 rolesContinue(cmd, newEmoji);
};


import { higherRolePosition, highestRole, requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";

export function addRole<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const addRole = bot.helpers.addRole;

  bot.helpers.addRole = async function (guildId, memberId, roleId, reason) {
    const guild = bot.cache.guilds.memory.get(bot.transformers.snowflake(guildId));
    if (guild) {
      const role = guild.roles.get(bot.transformers.snowflake(roleId));
      if (role) {
        const botRole = highestRole(bot, guild, bot.id);

        if (!higherRolePosition(bot, guild, botRole.id, role.id)) {
          throw new Error(
            `The bot can not add this role to the member because it does not have a role higher than the role ID: ${role.id}.`,
          );
        }
      }

      requireBotGuildPermissions(bot, guild, ["MANAGE_ROLES"]);
    }

    return await addRole(guildId, memberId, roleId, reason);
  };
}

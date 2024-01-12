import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits the widget settings for a guild.
 * @param guild The guild to edit the widget settings for.
 * @param body The new widget settings to apply.
 * @param reason The reason for editing the widget settings.
 * @returns A promise that resolves to an object containing the new widget settings.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildWidgetSettingsJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditWidgetSettings(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot edit widget settings`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .editWidgetSettings(guild.id, body, { reason })
  .then((w) => ({ enabled: w.enabled, channelId: w.channel_id }))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has permission to edit the widget settings for a guild.
 * @param me - The guild member to check.
 * @returns True if the guild member has permission to edit the widget settings for a guild,
 * false otherwise.
 */
export const canEditWidgetSettings = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);

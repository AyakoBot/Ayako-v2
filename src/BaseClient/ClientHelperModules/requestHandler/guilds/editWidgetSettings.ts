import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Edits the widget settings for a guild.
 * @param guild The guild to edit the widget settings for.
 * @param body The new widget settings to apply.
 * @param reason The reason for editing the widget settings.
 * @returns A promise that resolves to an object containing the new widget settings.
 */
export default (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildWidgetSettingsJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editWidgetSettings(guild.id, body, { reason })
  .then((w) => ({ enabled: w.enabled, channelId: w.channel_id }))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a guild.
 * @param guild The guild to edit.
 * @param body The data to edit the guild with.
 * @returns A promise that resolves with the edited guild.
 */
export default async (guild: Discord.Guild, body: Discord.RESTPatchAPIGuildJSONBody) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .edit(guild.id, {
   ...body,
   icon: body.icon ? await Discord.DataResolver.resolveImage(body.icon) : body.icon,
   splash: body.splash ? await Discord.DataResolver.resolveImage(body.splash) : body.splash,
   banner: body.banner ? await Discord.DataResolver.resolveImage(body.banner) : body.banner,
   discovery_splash: body.discovery_splash
    ? await Discord.DataResolver.resolveImage(body.discovery_splash)
    : body.discovery_splash,
  })
  .then((g) => new Classes.Guild(guild.client, g))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

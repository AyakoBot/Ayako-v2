import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a guild.
 * @param guild The guild to edit.
 * @param body The data to edit the guild with.
 * @returns A promise that resolves with the edited guild.
 */
export default async (guild: Discord.Guild, body: Discord.RESTPatchAPIGuildJSONBody) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEdit(await getBotMemberFromGuild(guild), guild, body)) {
  const e = requestHandlerError(`Cannot edit guild ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
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
};
/**
 * Checks if the given guild member has permission to edit the guild.
 * @param me - The guild member performing the edit.
 * @param guild - The guild being edited.
 * @param body - The JSON body containing the changes to be made.
 * @returns A boolean indicating whether the guild member can edit the guild.
 */
export const canEdit = (
 me: Discord.GuildMember,
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildJSONBody,
) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild) &&
 (!!guild.features.find((f) => f === Discord.GuildFeature.Community) !==
 !!body.features?.find((f) => f === Discord.GuildFeature.Community)
  ? me.permissions.has(Discord.PermissionFlagsBits.Administrator)
  : true);

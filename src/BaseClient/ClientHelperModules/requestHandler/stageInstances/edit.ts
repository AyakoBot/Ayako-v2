import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a stage instance in a stage channel.
 * @param channel The stage channel where the stage instance is located.
 * @param body The new properties for the stage instance.
 * @param reason The reason for editing the stage instance.
 * @returns A promise that resolves with the updated stage instance
 * or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.StageChannel,
 body: Discord.RESTPatchAPIStageInstanceJSONBody,
 reason?: string,
) =>
 (cache.apis.get(channel.guild.id) ?? API).stageInstances
  .edit(channel.id, body, { reason })
  .then((s) => new Classes.StageInstance(channel.client, s, channel))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

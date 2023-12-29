import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

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
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEdit(await getBotMemberFromGuild(channel.guild), channel.id)) {
  const e = requestHandlerError(
   `Cannot edit stage instance in ${channel.guild.name} / ${channel.guild.id}`,
   [Discord.PermissionFlagsBits.ManageChannels],
  );

  error(channel.guild, e);
  return e;
 }

 return (cache.apis.get(channel.guild.id) ?? API).stageInstances
  .edit(channel.id, body, { reason })
  .then((s) => new Classes.StageInstance(channel.client, s, channel))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to edit stage instances.
 * @param me - The Discord guild member.
 * @param channelId - The ID of the stage channel where the stage instance is located.
 * @returns A boolean indicating whether the guild member can edit stage instances.
 */
export const canEdit = (me: Discord.GuildMember, channelId: string) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageChannels);

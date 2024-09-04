import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Creates a new stage instance associated with a stage channel.
 * @param channel The stage channel to associate the stage instance with.
 * @param body The JSON body of the API request.
 * @param reason The reason for creating the stage instance.
 * @returns A promise that resolves with the created stage instance
 * or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.StageChannel,
 body: Discord.RESTPostAPIStageInstanceJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreate(await getBotMemberFromGuild(channel.guild), channel.id)) {
  const e = requestHandlerError(
   `Cannot create stage instance in ${channel.guild.name} / ${channel.guild.id}`,
   [Discord.PermissionFlagsBits.ManageChannels],
  );

  error(channel.guild, e);
  return e;
 }

 return (await getAPI(channel.guild)).stageInstances
  .create(body, { reason })
  .then((s) => new Classes.StageInstance(channel.client, s, channel))
  .catch((e: Discord.DiscordAPIError) => {
   error(channel.guild, e);
   return e;
  });
};

/**
 * Checks if the given guild member has the permission to create a stage instance.
 * @param me - The Discord guild member.
 * @param channelId - The ID of the stage channel to associate the stage instance with.
 * @returns A boolean indicating whether the guild member can create a stage instance.
 */
export const canCreate = (me: Discord.GuildMember, channelId: string) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageChannels);

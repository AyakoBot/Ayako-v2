import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the invites for a given guild-based channel.
 * @param channel - The guild-based channel to retrieve invites for.
 * @returns A promise that resolves with an array of parsed invite objects.
 */
export default async (channel: Discord.GuildBasedChannel) => {
 if (!canGetInvites(channel.id, await channel.client.util.getBotMemberFromGuild(channel.guild))) {
  const e = channel.client.util.requestHandlerError(
   `Cannot get invites in ${channel.name} / ${channel.id}`,
   [Discord.PermissionFlagsBits.ManageChannels],
  );

  channel.client.util.error(channel.guild, e);
  return e;
 }

 return (
  channel.guild
   ? channel.client.util.cache.apis.get(channel.guild.id) ??
     new DiscordCore.API(channel.client.rest)
   : new DiscordCore.API(channel.client.rest)
 ).channels
  .getInvites(channel.id)
  .then((invites) => {
   const parsed = invites.map((i) => new Classes.Invite(channel.client, i));
   parsed.forEach((p) => {
    if (channel.guild.invites.cache.get(p.code)) return;
    channel.guild.invites.cache.set(p.code, p);
   });
   return parsed;
  })
  .catch((e) => {
   channel.client.util.error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has permission to get invites in a guild-based channel.
 * @param channelId - The ID of the guild-based channel to check permissions in.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user has permission to get invites.
 */
export const canGetInvites = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageChannels);

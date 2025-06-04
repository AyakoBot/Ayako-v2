import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';
import edit from '../channels/edit.js';
import del from '../channels/delete.js';

/**
 * Creates a new channel in the specified guild.
 * @param guild The guild where the channel will be created.
 * @param body The channel data to be sent to the API.
 * @param reason The reason for creating the channel.
 * @returns A promise that resolves with the created channel or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildChannelJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 const me = await getBotMemberFromGuild(guild);

 const needs2Steps =
  !me.permissions.has(Discord.PermissionFlagsBits.Administrator) &&
  body.permission_overwrites?.some((p) =>
   p.allow
    ? new Discord.PermissionsBitField(BigInt(p.allow)).has(Discord.PermissionFlagsBits.ManageRoles)
    : false,
  ) &&
  body.parent_id &&
  ((
   me.guild.channels.cache.get(String(body.parent_id)) as Discord.CategoryChannel
  )?.permissionOverwrites.cache
   .get(me.id)
   ?.allow.has(Discord.PermissionFlagsBits.ManageRoles) ??
   false);

 if (!canCreateChannel(await getBotMemberFromGuild(guild), body)) {
  const e = requestHandlerError(`Cannot create channel`, [
   Discord.PermissionFlagsBits.ManageChannels,
  ]);

  e.message += `\n${
   requestHandlerError(
    "Every permission I'm trying to set.",
    new Discord.PermissionsBitField(
     body.permission_overwrites?.map(
      (p) => new Discord.PermissionsBitField(BigInt(p.allow ?? 0n)).bitfield,
     ) || [0n],
    )
     .toArray()
     .map((perm) => Discord.PermissionFlagsBits[perm]),
   ).message
  }`;

  if (
   body.permission_overwrites?.some((p) =>
    new Discord.PermissionsBitField(BigInt(p.allow ?? 0n)).has(
     Discord.PermissionFlagsBits.ManageRoles,
    ),
   ) &&
   !needs2Steps
  ) {
   e.message += `\n${requestHandlerError('Permissions in the parent channel', [Discord.PermissionFlagsBits.ManageRoles]).message}`;
  }

  error(guild, new Error(e.message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .createChannel(guild.id, needs2Steps ? { ...body, permission_overwrites: [] } : body, { reason })
  .then(async (c) => {
   const channel = Classes.Channel(guild.client, c, guild) as Discord.GuildBasedChannel;
   if (!needs2Steps) return channel;

   const editRes = await edit(channel, {
    permission_overwrites: [
     ...(body.permission_overwrites as Discord.RESTPatchAPIChannelJSONBody['permission_overwrites'])!,
     {
      id: me.id,
      type: Discord.OverwriteType.Member,
      allow: channel.permissionsFor(me, false).bitfield.toString(),
     },
    ],
   });

   if ('message' in editRes) {
    del(channel);
    return editRes;
   }
   return channel;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if the given guild member has the necessary permissions
 * to create a channel with the specified properties.
 * @param me - The Discord guild member object representing the bot.
 * @param body - The JSON body containing the properties of the channel to be created.
 * @returns A boolean indicating whether the guild member can create the channel.
 */
export const canCreateChannel = (
 me: Discord.GuildMember,
 body: Discord.RESTPostAPIGuildChannelJSONBody,
) =>
 me.guild.ownerId === me.id ||
 me.permissions.has(Discord.PermissionFlagsBits.Administrator) ||
 (me.permissions.has(Discord.PermissionFlagsBits.ManageChannels) &&
  (body.permission_overwrites
   ? body.permission_overwrites.every((p) =>
      me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
      me.permissions.has(BigInt(p.allow ?? 0n)) &&
      new Discord.PermissionsBitField(BigInt(p.allow ?? 0n)).has(
       Discord.PermissionFlagsBits.ManageRoles,
      )
       ? body.parent_id &&
         ((
          me.guild.channels.cache.get(String(body.parent_id)) as Discord.CategoryChannel
         )?.permissionOverwrites.cache
          .get(me.id)
          ?.allow.has(Discord.PermissionFlagsBits.ManageRoles) ??
          false)
       : true,
     )
   : true));

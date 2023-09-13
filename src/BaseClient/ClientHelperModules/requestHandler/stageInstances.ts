import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

const cacheSetter = (
 cacheItem: unknown,
 // eslint-disable-next-line @typescript-eslint/ban-types
 cacheSet: Function | undefined,
 item: unknown,
 key?: string,
) => {
 if (!cacheSet) return;
 if (!cacheItem) cacheSet(key ?? (item as { [key: string]: string }).id, item);
};

export default {
 create: (
  channel: Discord.StageChannel,
  body: Discord.RESTPostAPIStageInstanceJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(channel.guild.id) ?? API).stageInstances
   .create(body, { reason })
   .then((s) => new Classes.StageInstance(channel.client, s, channel))
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 get: (channel: Discord.StageChannel) =>
  (cache.apis.get(channel.guild.id) ?? API).stageInstances
   .get(channel.id)
   .then((s) => {
    const parsed = new Classes.StageInstance(channel.client, s, channel);
    cacheSetter(
     channel.guild.stageInstances.cache.get(parsed.id),
     channel.guild.stageInstances.cache.set,
     parsed,
    );
    channel.guild.stageInstances.cache.set(parsed.channelId, parsed);
    return parsed;
   })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 edit: (
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
   }),
 delete: (guild: Discord.Guild, channelId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).stageInstances.delete(channelId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
};

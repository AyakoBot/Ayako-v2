import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';
import getPathFromError from './getPathFromError.js';
import { canSetVCStatus } from './requestHandler/channels/setVCStatus.js';

const ChannelCache: Map<
 string,
 {
  job: Jobs.Job;
  statuses: Set<{ status: string; stickTime: number }>;
  channel: Discord.BaseGuildVoiceChannel;
  oldStatus: string;
 }
> = new Map();

/**
 * A module for managing the status of a Discord voice channel.
 */
const statusManager = {
 /**
  * Adds a status to a voice channel.
  * @param channel - The voice channel to add the status to.
  * @param status - The status to set for the channel.
  * @param stickTime - The duration (in milliseconds) for which the status should stick.
  */
 add: async (channel: Discord.BaseGuildVoiceChannel, status: string, stickTime: number) => {
  const channelCache = ChannelCache.get(channel.id);
  if (channelCache) {
   channelCache.statuses.add({ status, stickTime });
   return;
  }

  ChannelCache.set(channel.id, {
   job: Jobs.scheduleJob(
    getPathFromError(new Error(channel.id)),
    new Date(Date.now() + stickTime),
    () => runJob(channel),
   ),
   statuses: new Set([{ status, stickTime }]),
   oldStatus: channel.client.util.cache.voiceChannelStatus.get(channel.id) || '',
   channel,
  });
 },
};

export default statusManager;

/**
 * Runs a job to manage the status of a voice channel.
 * @param channel - The voice channel to manage the status for.
 */
const runJob = async (channel: Discord.BaseGuildVoiceChannel) => {
 const channelCache = ChannelCache.get(channel.id);
 if (!channelCache) return;

 const me = await getBotMemberFromGuild(channel.guild);
 if (!canSetVCStatus(channel.id, me)) {
  ChannelCache.delete(channel.id);
  return;
 }

 const status = channelCache.statuses.values().next().value;
 if (!status) {
  channel.client.util.request.channels.setVCStatus(channel, channelCache.oldStatus);
  ChannelCache.delete(channel.id);
  return;
 }
 channelCache.statuses.delete(status);
 channel.client.util.request.channels.setVCStatus(channel, status.status);

 channelCache.job = Jobs.scheduleJob(
  channel.client.util.getPathFromError(new Error(channel.id)),
  new Date(Date.now() + status.stickTime),
  () => runJob(channel),
 );
};

import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import deleteThread from './deleteNotificationThread.js';
import { UsualMessagePayload } from '../../Typings/Typings.js';
import getPathFromError from './getPathFromError.js';

/**
 * Creates a notification thread for a target guild member.
 * @param target The guild member to create the thread for.
 * @param payload The payload containing the message to send.
 * @returns The message sent in the thread, or undefined if an error occurred.
 */
export default async (
 target: Discord.GuildMember,
 payload: UsualMessagePayload,
): Promise<undefined | Discord.Message<true>> => {
 const channel =
  target.guild.rulesChannel ??
  target.guild.systemChannel ??
  (target.guild.channels.cache.find(
   (c) =>
    ![
     Discord.ChannelType.AnnouncementThread,
     Discord.ChannelType.GuildCategory,
     Discord.ChannelType.GuildDirectory,
     Discord.ChannelType.GuildForum,
     Discord.ChannelType.GuildMedia,
     Discord.ChannelType.GuildStageVoice,
     Discord.ChannelType.PrivateThread,
     Discord.ChannelType.PublicThread,
    ].includes(c.type) && c.permissionsFor(target).has(Discord.PermissionFlagsBits.ViewChannel),
  ) as Exclude<
   Discord.Channel,
   {
    type:
     | Discord.ChannelType.DM
     | Discord.ChannelType.GroupDM
     | Discord.ChannelType.AnnouncementThread
     | Discord.ChannelType.GuildCategory
     | Discord.ChannelType.GuildDirectory
     | Discord.ChannelType.GuildForum
     | Discord.ChannelType.GuildMedia
     | Discord.ChannelType.GuildStageVoice
     | Discord.ChannelType.PrivateThread
     | Discord.ChannelType.PublicThread;
   }
  >);
 if (!channel) return undefined;
 if (!target) return;

 const thread = await target.client.util.request.channels.createThread(channel, {
  type: Discord.ChannelType.PrivateThread,
  invitable: false,
  name: target.client.util.constants.standard.getEmote(target.client.util.emotes.warning),
 });
 if ('message' in thread) return undefined;
 putDel(target, thread);

 const member = await target.client.util.request.threads.addMember(thread, target.id);
 if (member && 'message' in member) return undefined;

 const message = await target.client.util.send(thread, payload);
 if (message && 'message' in message) return undefined;

 return (message as Discord.Message<true> | void | undefined) || undefined;
};

const putDel = (target: Discord.GuildMember, thread: Discord.ThreadChannel) =>
 target.client.util.cache.deleteThreads.set(
  Jobs.scheduleJob(
   getPathFromError(new Error(thread.id)),
   new Date(Date.now() + (thread.autoArchiveDuration ?? 60) * 60 * 1000),
   () => {
    deleteThread(target.guild, thread.id);
   },
  ),
  target.guild.id,
  thread.id,
 );

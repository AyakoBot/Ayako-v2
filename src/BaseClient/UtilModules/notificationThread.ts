import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import { Colors, UsualMessagePayload } from '../../Typings/Typings.js';
import deleteThread from './deleteNotificationThread.js';
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
 const settings = await target.client.util.DataBase.guildsettings.findUnique({
  where: { guildid: target.guild.id },
  select: { notifychannel: true },
 });

 const channel =
  (settings?.notifychannel
   ? (target.guild.channels.cache.get(settings.notifychannel) as Discord.GuildTextBasedChannel)
   : null) ??
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
 if (!channel || !('threads' in channel)) return undefined;
 if (!target) return;

 const active = await target.client.util.request.guilds
  .getActiveThreads(target.guild)
  .then((m) => ('message' in m ? undefined : m));
 if (
  channel.threads.cache.filter((t) => !t.archived).size > 900 ||
  Number(active?.filter((t) => t.parentId === channel.id).length) > 900
 ) {
  const oldestThread = await channel.client.util.DataBase.deletethreads.findFirst({
   where: { channelid: { in: channel.threads.cache.map((c) => c.id) } },
   orderBy: { deletetime: 'asc' },
  });

  if (!oldestThread) return;

  channel.client.util.cache.deleteThreads.delete(oldestThread.guildid, oldestThread.channelid);
  await deleteThread(channel.guild, oldestThread.channelid);
 }

 const thread = await target.client.util.request.channels.createThread(channel, {
  type: Discord.ChannelType.PrivateThread,
  invitable: false,
  name: target.client.util.constants.standard.getEmote(target.client.util.emotes.warning),
 });
 if ('message' in thread) return undefined;
 putDel(target, thread);

 const member = await target.client.util.request.threads.addMember(thread, target.id);
 if (member && 'message' in member) return undefined;

 const finishedPayload = convertLinkButtons2EmbedLinks(payload);
 const message = await target.client.util.send(thread, finishedPayload);
 if (message && 'message' in message) return undefined;

 if (!finishedPayload.components?.length) {
  target.client.util.request.channels.edit(thread, { locked: true });
 }

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

// TODO: check status https://github.com/discord/discord-api-docs/issues/6907
const convertLinkButtons2EmbedLinks = (payload: UsualMessagePayload): UsualMessagePayload => {
 const linkButtons = payload.components
  ?.map((c) =>
   c.components.filter(
    (b) => b.type === Discord.ComponentType.Button && b.style === Discord.ButtonStyle.Link,
   ),
  )
  .flat() as Discord.APIButtonComponentWithURL[] | undefined;
 if (!linkButtons?.length) return payload;

 const newComponents:
  | Discord.APIActionRowComponent<Discord.APIButtonComponent | Discord.APISelectMenuComponent>[]
  | undefined = (
  payload.components?.map((c) => ({
   type: Discord.ComponentType.ActionRow,
   components: c.components.filter(
    (b) =>
     b.type !== Discord.ComponentType.Button ||
     (b.type === Discord.ComponentType.Button && b.style !== Discord.ButtonStyle.Link),
   ),
  })) as
   | Discord.APIActionRowComponent<Discord.APIButtonComponent | Discord.APISelectMenuComponent>[]
   | undefined
 )?.filter((c) => c.components.length);

 if (!payload.embeds?.length) payload.embeds = [];
 payload.embeds.push({
  description: linkButtons.map((b) => `🔗 [${b.label}](${b.url})`).join(' | '),
  color: Colors.Ephemeral,
 });

 return { ...payload, components: newComponents };
};

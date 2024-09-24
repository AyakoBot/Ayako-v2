import * as Discord from 'discord.js';

type ClearType =
 | 'all'
 | 'user'
 | 'between'
 | 'match'
 | 'not-match'
 | 'starts-with'
 | 'ends-with'
 | 'includes'
 | 'links'
 | 'invites'
 | 'images'
 | 'videos'
 | 'files'
 | 'audio'
 | 'mentions'
 | 'stickers'
 | 'embeds'
 | 'text'
 | 'humans'
 | 'bots';

export default async (
 cmd: Discord.ChatInputCommandInteraction,
 _args: string[],
 type: ClearType = 'all',
) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.channel) return;

 await cmd.deferReply({ ephemeral: true });

 const amount = cmd.options.getInteger('amount', false);
 const channel =
  cmd.options.getChannel('channel', false, [
   Discord.ChannelType.AnnouncementThread,
   Discord.ChannelType.PublicThread,
   Discord.ChannelType.GuildAnnouncement,
   Discord.ChannelType.PrivateThread,
   Discord.ChannelType.GuildStageVoice,
   Discord.ChannelType.GuildText,
   Discord.ChannelType.GuildVoice,
  ]) ?? cmd.channel;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.clear;
 const allMessages = (await getMessages(type, cmd as Parameters<typeof getMessages>[1], channel))
  .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
  .filter((m) => m.createdTimestamp > Date.now() - 1209600000);
 const messages = amount ? allMessages.slice(0, amount) : allMessages;

 if (!messages.length) {
  cmd.client.util.errorCmd(cmd, lan.noMessagesFound, language);
  return;
 }

 cmd.client.util
  .getChunks(
   messages.map((m) => m.id),
   100,
  )
  .forEach((c) => {
   cmd.client.util.request.channels.bulkDelete(channel as Discord.GuildTextBasedChannel, c);
  });

 cmd.editReply({
  content: lan.deleted(messages.length),
  message: '@original',
 });
};

const getMessages = async (
 type: ClearType,
 cmd: Discord.ChatInputCommandInteraction<'cached'> & { channel: Discord.GuildTextBasedChannel },
 channel: Discord.GuildTextBasedChannel,
) => {
 switch (type) {
  case 'user':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => m.author.id === cmd.options.getUser('user', true).id,
   );
  case 'bots':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => m.author?.bot,
   );
  case 'humans':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => !m.author?.bot,
   );
  case 'audio':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter((m) =>
    m.attachments.some((a) => a.contentType?.startsWith('audio')),
   );
  case 'images':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter((m) =>
    m.attachments.some((a) => a.contentType?.startsWith('image')),
   );
  case 'videos':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter((m) =>
    m.attachments.some((a) => a.contentType?.startsWith('video')),
   );
  case 'files':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => !!m.attachments.size,
   );
  case 'ends-with':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter((m) =>
    m.content.endsWith(cmd.options.getString('content', true)),
   );
  case 'includes':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter((m) =>
    m.content.includes(cmd.options.getString('content', true)),
   );
  case 'invites':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter((m) =>
    m.content.includes('discord.gg/'),
   );
  case 'starts-with':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter((m) =>
    m.content.startsWith(cmd.options.getString('content', true)),
   );
  case 'links':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) =>
     !!m.content.match(cmd.client.util.regexes.urlTester(cmd.client.util.cache.urlTLDs.toArray()))
      ?.length,
   );
  case 'mentions':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) =>
     m.mentions.channels.size ||
     m.mentions.users.filter((u) => m.mentions.repliedUser?.id === u.id).size ||
     m.mentions.roles.size ||
     m.mentions.everyone,
   );
  case 'stickers':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => m.stickers.size,
   );
  case 'embeds':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => m.embeds.length,
   );
  case 'text':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => m.content.length && !m.attachments.size && !m.embeds.length && !m.stickers.size,
   );
  case 'match':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => m.content.toLowerCase() === cmd.options.getString('content', true).toLowerCase(),
   );
  case 'not-match':
   return (await cmd.client.util.fetchMessages(channel, { amount: 500 })).filter(
    (m) => m.content.toLowerCase() !== cmd.options.getString('content', true).toLowerCase(),
   );
  case 'between': {
   const first = cmd.options.getString('first-message-url', true);
   const second = cmd.options.getString('second-message-url', false);

   const messages = await cmd.client.util.fetchMessages(channel, { amount: 500 });

   const one = first
    ? messages.find(
       (m) => m.url === first.replace('canary.', '').replace('ptb.', '') || m.id === first,
      )
    : channel?.lastMessage;
   const two = second
    ? messages.find(
       (m) => m.url === second.replace('canary.', '').replace('ptb.', '') || m.id === second,
      )
    : one;

   const [start, end] =
    Number(two?.createdTimestamp) < Number(one?.createdTimestamp)
     ? [two ?? undefined, one ?? undefined]
     : [one ?? undefined, two ?? undefined];

   return !start || !end
    ? []
    : messages.filter(
       (m) => m.id !== start.id && m.id !== end.id && m.createdTimestamp > start.createdTimestamp,
      );
  }
  case 'all':
  default: {
   return cmd.client.util.fetchMessages(channel, { amount: 100 });
  }
 }
};

import type { ButtonInteraction, GuildTextBasedChannel } from 'discord.js';

export default async (cmd: ButtonInteraction) => {
 if (!cmd.channel) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const dmTicket = await cmd.client.util.DataBase.dMTicket.findFirst({
  where: { userId: cmd.user.id },
  include: { settings: true },
 });
 if (!dmTicket) {
  cmd.update({ embeds: [{ description: language.ticketing.ticketAlreadyClosed }] });
  return;
 }

 if (!cmd.message.embeds.length) {
  cmd.update({ embeds: [{ description: language.ticketing.leaveSure }] });
  return;
 }

 cmd.client.util.DataBase.dMTicket.deleteMany({ where: { userId: cmd.user.id } }).then();

 cmd.client.cluster?.broadcastEval(
  async (
   cl,
   {
    authorName,
    authorAvatar,
    authorId,
    ticketChannelId,
    logChannelIds,
    messageId,
    dmId,
   }: {
    authorName: string;
    authorAvatar: string;
    authorId: string;
    ticketChannelId: string;
    logChannelIds: string[];
    messageId: string;
    dmId: string;
   },
  ) => {
   const channel = cl.channels.cache.get(ticketChannelId) as GuildTextBasedChannel;
   if (!channel) return;

   const language = await cl.util.getLanguage(channel.guild.id);

   cl.util.send(channel, {
    embeds: [
     {
      author: { name: authorName, icon_url: authorAvatar },
      color: cl.util.Colors.Danger,
      description: `${cl.util.constants.standard.getEmote(cl.util.emotes.crossWithBackground)}: ${language.ticketing.leftTicket}`,
     },
    ],
   });

   cl.util.send(
    { id: logChannelIds, guildId: channel.guild.id },
    {
     embeds: [
      {
       author: { name: language.ticketing.logs.authorLeave },
       description: language.ticketing.logs.descLeave(
        { bot: false, id: authorId, username: authorName, discriminator: '0' },
        channel,
       ),
       color: cl.util.Colors.Loading,
      },
     ],
    },
   );

   cl.util.request.channels.unpin(
    { guild: undefined, id: messageId, channelId: dmId },
    channel.guild,
   );
  },
  {
   context: {
    authorName: cmd.user.username,
    authorAvatar: cmd.user.displayAvatarURL(),
    authorId: cmd.user.id,
    ticketChannelId: dmTicket?.channelId,
    logChannelIds: dmTicket.settings.logChannelIds || [],
    messageId: cmd.message.id,
    dmId: cmd.channel.id,
   },
  },
 );

 cmd.update({
  content: language.ticketing.ticketLeft,
  components: [],
  embeds: [],
 });
};

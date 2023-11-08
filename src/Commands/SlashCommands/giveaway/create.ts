import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import { end, getGiveawayEmbed, getButton } from './end.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const prizeDesc = cmd.options.getString('prize-description', true);
 const time = cmd.options.getString('time', true);
 const winners = cmd.options.getInteger('winners', true);
 const channel =
  cmd.options.getChannel('channel', false, [
   Discord.ChannelType.GuildAnnouncement,
   Discord.ChannelType.GuildText,
   Discord.ChannelType.GuildVoice,
   Discord.ChannelType.GuildStageVoice,
   Discord.ChannelType.PublicThread,
   Discord.ChannelType.PrivateThread,
   Discord.ChannelType.AnnouncementThread,
  ]) || (cmd.channel as Discord.GuildTextBasedChannel);
 if (!channel) {
  ch.error(cmd.guild, new Error('Channel not found'));
  return;
 }

 const role = cmd.options.getRole('role', false);
 const host = cmd.options.getUser('host', false) ?? cmd.user;
 const prize = cmd.options.getString('prize', false);
 const claimTimeout = cmd.options.getString('claiming-timeout', false);
 const claimFailReroll = cmd.options.getBoolean('claim-fail-reroll', false);

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.create;

 const duration = ch.getDuration(time);
 const endTime = Date.now() + Math.abs(duration);
 if (!endTimeIsValid(endTime, cmd, language)) return;
 if (
  !canSendMessage(
   channel,
   cmd as CT.NeverNull<Discord.ChatInputCommandInteraction, 'guild'>,
   language,
  )
 ) {
  return;
 }

 const collectTime = claimTimeout ? Math.abs(ch.getDuration(claimTimeout)) : null;
 if (collectTime && collectTime < 3600000) {
  ch.errorCmd(cmd, lan.collectTimeTooShort, language);
  return;
 }

 const msg = await ch.request.channels.sendMessage(
  cmd.guild,
  channel.id,
  {
   embeds: [ch.loadingEmbed({ language, lan })],
  },
  cmd.client,
 );

 if (!msg || 'message' in msg) {
  ch.errorCmd(cmd, msg ?? language.Unknown, language);
  return;
 }

 const giveaway = await ch.DataBase.giveaways.create({
  data: {
   guildid: cmd.guild.id,
   msgid: msg.id,
   description: prizeDesc,
   winnercount: winners,
   endtime: endTime,
   reqrole: role?.id,
   actualprize: prize,
   host: host.id,
   channelid: channel.id,
   collecttime: collectTime,
   failreroll: claimFailReroll ?? false,
  },
 });

 if (!giveaway) {
  ch.errorCmd(cmd, language.Unknown, language);
  if (await ch.isDeleteable(msg)) ch.request.channels.deleteMessage(msg);
  return;
 }

 await ch.request.channels.editMsg(msg, {
  embeds: [await getGiveawayEmbed(language, giveaway)],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [getButton(language, giveaway)],
   },
  ],
 });

 ch.replyCmd(cmd, {
  content: lan.sent(channel),
 });

 ch.cache.giveaways.set(
  Jobs.scheduleJob(new Date(endTime), () => {
   end(giveaway);
  }),
  cmd.guildId as string,
  cmd.channelId,
  msg.id,
 );
};

const canSendMessage = async (
 channel: Discord.StageChannel | Discord.GuildTextBasedChannel,
 cmd: CT.NeverNull<Discord.ChatInputCommandInteraction, 'guild'>,
 language: CT.Language,
) => {
 const me = await ch.getBotMemberFromGuild(cmd.guild);
 if (!me) {
  ch.error(cmd.guild, new Error('Cannot find self in guild'));
  return false;
 }

 if (
  me.permissionsIn(channel).has(Discord.PermissionFlagsBits.SendMessages) &&
  me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ViewChannel)
 ) {
  return true;
 }

 ch.errorCmd(
  cmd as Discord.ChatInputCommandInteraction,
  language.slashCommands.giveaway.create.missingPermissions,
  language,
 );
 return false;
};

export const endTimeIsValid = (
 endTime: number,
 cmd: Discord.ChatInputCommandInteraction,
 language: CT.Language,
) => {
 try {
  new Date(endTime);
 } catch (e) {
  ch.errorCmd(cmd, e as Error, language);
  return false;
 }

 return true;
};

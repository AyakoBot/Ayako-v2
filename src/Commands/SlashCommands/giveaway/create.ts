import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as CT from '../../../Typings/Typings.js';
import { end, getButton, getGiveawayEmbed } from './end.js';
import { canSendMessage } from '../../../BaseClient/UtilModules/requestHandler/channels/sendMessage.js';
import getPathFromError from '../../../BaseClient/UtilModules/getPathFromError.js';

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
  cmd.client.util.error(cmd.guild, new Error('Channel not found'));
  return;
 }

 const role = cmd.options.getRole('role', false);
 const host = cmd.options.getUser('host', false) ?? cmd.user;
 const prize = cmd.options.getString('prize', false);
 const claimTimeout = cmd.options.getString('claiming-timeout', false);
 const claimFailReroll = cmd.options.getBoolean('claim-fail-reroll', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.create;

 const duration = cmd.client.util.getDuration(time);
 const endTime = Date.now() + Math.abs(duration);
 if (!endTimeIsValid(endTime, cmd, language)) return;
 if (
  !canSend(channel.id, cmd as CT.NeverNull<Discord.ChatInputCommandInteraction, 'guild'>, language)
 ) {
  return;
 }

 const collectTime = claimTimeout ? Math.abs(cmd.client.util.getDuration(claimTimeout)) : null;
 if (collectTime && collectTime < 3600000) {
  cmd.client.util.errorCmd(cmd, lan.collectTimeTooShort, language);
  return;
 }

 const msg = await cmd.client.util.request.channels.sendMessage(
  cmd.guild,
  channel.id,
  {
   embeds: [cmd.client.util.loadingEmbed({ language, lan })],
  },
  cmd.client,
 );

 if (!msg || 'message' in msg) {
  cmd.client.util.errorCmd(cmd, msg ?? language.t.Unknown, language);
  return;
 }

 const giveaway = await cmd.client.util.DataBase.giveaways.create({
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
  cmd.client.util.errorCmd(cmd, language.t.Unknown, language);
  if (await cmd.client.util.isDeleteable(msg)) cmd.client.util.request.channels.deleteMessage(msg);
  return;
 }

 await cmd.client.util.request.channels.editMsg(msg, {
  embeds: [await getGiveawayEmbed(language, giveaway)],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [getButton(language, giveaway)],
   },
  ],
 });

 cmd.client.util.replyCmd(cmd, {
  content: lan.sent(channel),
 });

 cmd.client.util.cache.giveaways.set(
  Jobs.scheduleJob(getPathFromError(new Error(giveaway.msgid)), new Date(endTime), () => {
   end(giveaway);
  }),
  cmd.guildId as string,
  cmd.channelId,
  msg.id,
 );
};

const canSend = async (
 channelId: string,
 cmd: CT.NeverNull<Discord.ChatInputCommandInteraction, 'guild'>,
 language: CT.Language,
) => {
 const me = await cmd.client.util.getBotMemberFromGuild(cmd.guild);
 if (canSendMessage(channelId, { embeds: [], components: [] }, me)) {
  return true;
 }

 cmd.client.util.errorCmd(
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
  cmd.client.util.errorCmd(cmd, e as Error, language);
  return false;
 }

 return true;
};

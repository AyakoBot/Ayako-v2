import * as Discord from 'discord.js';
import { PunishmentType } from '@prisma/client';
import * as CT from '../../../../Typings/Typings.js';

export default async (msg: Discord.Message<true>) => {
 if (msg.author.bot) return;
 if (!msg.guildId) return;
 if (msg.member?.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;

 const settings = await msg.client.util.DataBase.invites.findUnique({
  where: {
   guildid: msg.guildId ?? msg.guild.id,
   active: true,
   NOT: {
    wlchannelid: { has: msg.channelId },
    wlroleid: { hasSome: msg.member?.roles.cache.map((r) => r.id) || [] },
   },
  },
 });
 if (!settings) return;

 const hasInvite = await checkForInvite(msg.content, msg.guild);
 if (!hasInvite) return;

 const language = await msg.client.util.getLanguage(msg.guildId);
 if (
  msg.type !== Discord.MessageType.AutoModerationAction &&
  (await msg.client.util.isDeleteable(msg))
 ) {
  msg.client.util.request.channels.deleteMessage(msg);
 }

 const modOptions: CT.BaseOptions = {
  reason: language.censor.reasonInvite,
  guild: msg.guild,
  target: msg.author,
  executor: (await msg.client.util.getBotMemberFromGuild(msg.guild)).user,
  dbOnly: false,
  skipChecks: false,
 };

 switch (settings.action) {
  case PunishmentType.ban:
   msg.client.util.mod(msg, CT.ModTypes.BanAdd, {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  case PunishmentType.channelban:
   msg.client.util.mod(msg, CT.ModTypes.ChannelBanAdd, {
    ...modOptions,
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
   break;
  case PunishmentType.kick:
   msg.client.util.mod(msg, CT.ModTypes.KickAdd, modOptions);
   break;
  case PunishmentType.tempmute:
   msg.client.util.mod(msg, CT.ModTypes.TempMuteAdd, {
    ...modOptions,
    duration: Number(settings.duration),
   });
   break;
  case PunishmentType.tempchannelban:
   msg.client.util.mod(msg, CT.ModTypes.TempChannelBanAdd, {
    ...modOptions,
    duration: Number(settings.duration),
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
   break;
  case PunishmentType.warn:
   msg.client.util.mod(msg, CT.ModTypes.WarnAdd, modOptions);
   break;
  case PunishmentType.strike:
   msg.client.util.mod(msg, CT.ModTypes.StrikeAdd, modOptions);
   break;
  case PunishmentType.tempban:
   msg.client.util.mod(msg, CT.ModTypes.TempBanAdd, {
    ...modOptions,
    duration: Number(settings.duration),
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  case PunishmentType.softban:
   msg.client.util.mod(msg, CT.ModTypes.SoftBanAdd, {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  default: {
   msg.client.util.mod(msg, CT.ModTypes.SoftWarnAdd, {
    ...modOptions,
    reason: language.censor.warnInvite,
   });
  }
 }
};

const checkForInvite = async (content: string, guild: Discord.Guild): Promise<boolean> => {
 const pureMatches = content.match(guild.client.util.regexes.inviteTester);
 if (pureMatches?.length) {
  const anyIsExternal = (
   await Promise.all(pureMatches.map((i) => isExternalInviteSource(i, guild)))
  ).some((i) => !!i);

  if (anyIsExternal) return true;
 }

 if (
  !content.match(guild.client.util.regexes.urlTester(guild.client.util.cache.urlTLDs.toArray()))
 ) {
  return false;
 }

 const args = content.split(/(\s+|\n+)/g);
 const argsContainingLink = args
  .filter((a) => a.includes('.'))
  .filter((arg) =>
   arg.match(guild.client.util.regexes.urlTester(guild.client.util.cache.urlTLDs.toArray())),
  );

 const results = await Promise.all(
  argsContainingLink.map((arg) => guild.client.util.fetchWithRedirects(arg)),
 );

 const fetchedMatches = results
  .flat()
  .map((url) => url.match(guild.client.util.regexes.inviteTester))
  .flat()
  .filter((i): i is string => !!i);

 if (!fetchedMatches?.length) return false;

 return (await Promise.all(fetchedMatches.map((i) => isExternalInviteSource(i, guild)))).some(
  (i) => !!i,
 );
};

const isExternalInviteSource = async (invite: string, guild: Discord.Guild) => {
 const inviteUrl = new URL(invite.startsWith('http') ? invite : `http://${invite}`);
 const code = inviteUrl.pathname.slice(1).replace('invite/', '');

 if (guild.invites.cache.has(code)) return false;

 const inviteData = await guild.client.util.request.invites.get(guild, code);
 if ('message' in inviteData) return false;
 if (inviteData.type !== Discord.InviteType.Guild) return false;

 return true;
};

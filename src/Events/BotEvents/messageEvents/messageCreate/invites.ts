import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (msg: Discord.Message<true>) => {
 if (msg.author.bot) return;
 if (!msg.guildId) return;
 if (msg.member?.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;

 const settings = await msg.client.util.DataBase.invites.findUnique({
  where: { guildid: msg.guildId ?? msg.guild.id, active: true },
 });
 if (!settings) return;
 if (settings.wlchannelid.includes(msg.channelId)) return;
 if (settings.wlroleid.some((id) => msg.member?.roles.cache.has(id))) return;

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
  executor: msg.client.user,
  dbOnly: false,
  skipChecks: false,
 };

 switch (settings.action) {
  case 'ban':
   msg.client.util.mod(msg, CT.ModTypes.BanAdd, {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  case 'channelban':
   msg.client.util.mod(msg, CT.ModTypes.ChannelBanAdd, {
    ...modOptions,
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
   break;
  case 'kick':
   msg.client.util.mod(msg, CT.ModTypes.KickAdd, modOptions);
   break;
  case 'tempmute':
   msg.client.util.mod(msg, CT.ModTypes.TempMuteAdd, {
    ...modOptions,
    duration: Number(settings.duration),
   });
   break;
  case 'tempchannelban':
   msg.client.util.mod(msg, CT.ModTypes.TempChannelBanAdd, {
    ...modOptions,
    duration: Number(settings.duration),
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
   break;
  case 'warn':
   msg.client.util.mod(msg, CT.ModTypes.WarnAdd, modOptions);
   break;
  case 'strike':
   msg.client.util.mod(msg, CT.ModTypes.StrikeAdd, modOptions);
   break;
  case 'tempban':
   msg.client.util.mod(msg, CT.ModTypes.TempBanAdd, {
    ...modOptions,
    duration: Number(settings.duration),
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  case 'softban':
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
  const anyIsNotFromGuild = pureMatches.filter(
   (m) =>
    !guild.invites.cache.has(new URL(m.startsWith('http') ? m : `http://${m}`).pathname.slice(1)),
  );
  if (anyIsNotFromGuild.length) return true;
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
 if (fetchedMatches?.length) {
  const anyIsNotFromGuild = fetchedMatches.filter(
   (m) =>
    !guild.invites.cache.has(
     new URL(m.startsWith('http') ? m : `http://${m}`).pathname.slice(1).replace('invite/', ''),
    ),
  );
  if (anyIsNotFromGuild.length) return true;
 }

 return false;
};

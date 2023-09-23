import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (msg: Discord.Message<true>) => {
 if (msg.author.bot) return;
 if (!msg.guildId) {
  console.log(msg.toJSON());
  return;
 }
 if (msg.member?.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;

 const settings = await ch.DataBase.invites.findUnique({
  where: { guildid: msg.guildId ?? msg.guild.id, active: true },
 });
 if (!settings) return;
 if (settings.wlchannelid.includes(msg.channelId)) return;
 if (settings.wlroleid.some((id) => msg.member?.roles.cache.has(id))) return;

 const hasInvite = await checkForInvite(msg.content, msg.guild);
 if (!hasInvite) return;

 const language = await ch.getLanguage(msg.guildId);
 if (msg.type !== Discord.MessageType.AutoModerationAction && (await ch.isDeleteable(msg))) {
  ch.request.channels.deleteMessage(msg);
 }

 const modOptions: CT.BaseOptions = {
  reason: language.censor.reasonInvite,
  guild: msg.guild,
  target: msg.author,
  executor: msg.client.user,
  dbOnly: false,
 };

 switch (settings.action) {
  case 'ban':
   ch.mod(msg, 'banAdd', {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  case 'channelban':
   ch.mod(msg, 'channelBanAdd', {
    ...modOptions,
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
   break;
  case 'kick':
   ch.mod(msg, 'kickAdd', modOptions);
   break;
  case 'tempmute':
   ch.mod(msg, 'tempMuteAdd', { ...modOptions, duration: Number(settings.duration) });
   break;
  case 'tempchannelban':
   ch.mod(msg, 'tempChannelBanAdd', {
    ...modOptions,
    duration: Number(settings.duration),
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
   break;
  case 'warn':
   ch.mod(msg, 'warnAdd', modOptions);
   break;
  case 'strike':
   ch.mod(msg, 'strikeAdd', modOptions);
   break;
  case 'tempban':
   ch.mod(msg, 'tempBanAdd', {
    ...modOptions,
    duration: Number(settings.duration),
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  case 'softban':
   ch.mod(msg, 'softBanAdd', {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  default: {
   ch.mod(msg, 'softWarnAdd', {
    ...modOptions,
    reason: language.censor.warnInvite,
   });
  }
 }
};

const checkForInvite = async (content: string, guild: Discord.Guild): Promise<boolean> => {
 const pureMatches = content.match(ch.regexes.inviteTester);
 if (pureMatches?.length) {
  const anyIsNotFromGuild = pureMatches.filter(
   (m) => !guild.invites.cache.has(new URL(m).pathname.slice(1)),
  );
  if (anyIsNotFromGuild.length) return true;
 }
 if (!content.match(ch.regexes.urlTester(ch.cache.urlTLDs.toArray()))) return false;

 const args = content.split(/(\s+|\n+)/g);
 const argsContainingLink = args
  .filter((a) => a.includes('.'))
  .filter((arg) => arg.match(ch.regexes.urlTester(ch.cache.urlTLDs.toArray())));

 const results = await Promise.all(argsContainingLink.map((arg) => ch.fetchWithRedirects(arg)));
 const fetchedMatches = results
  .flat()
  .map((url) => url.match(ch.regexes.inviteTester))
  .flat()
  .filter((i): i is string => !!i);
 if (fetchedMatches?.length) {
  const anyIsNotFromGuild = fetchedMatches.filter(
   (m) => !guild.invites.cache.has(new URL(m).pathname.slice(1)),
  );
  if (anyIsNotFromGuild.length) return true;
 }

 return false;
};

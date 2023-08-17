import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (msg: Discord.Message<true>) => {
 const settings = await ch.DataBase.blacklist.findUnique({
  where: { guildid: msg.guildId, active: true },
 });
 if (!settings) return;

 if (msg.member?.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
 if (msg.author.bot) return;

 const language = await ch.languageSelector(msg.guildId);

 newlines(msg, settings, language);
 invites(msg, settings, language);
};

const newlines = (
 msg: Discord.Message<true>,
 settings: Prisma.blacklist,
 language: CT.Language,
) => {
 if (!settings.maxnewlines) return;
 if (settings.newlineswlchannelid.includes(msg.channelId)) return;
 if (settings.newlineswlroleid.some((id) => msg.member?.roles.cache.has(id))) return;

 const amountOfNewlines = msg.content.split('\n').length - 1;
 if (amountOfNewlines <= Number(settings.maxnewlines)) return;
 if (msg.deletable) msg.delete().catch(() => undefined);

 const modOptions: CT.BaseOptions = {
  reason: language.blacklist.reasonNewlines,
  guild: msg.guild,
  target: msg.author,
  executor: msg.client.user,
  dbOnly: false,
 };

 switch (settings.newlinesaction) {
  case 'ban':
   ch.mod(msg, 'banAdd', {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.newlinesdeletemessageseconds) > 604800
      ? 604800
      : Number(settings.newlinesdeletemessageseconds),
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
   ch.mod(msg, 'tempMuteAdd', { ...modOptions, duration: Number(settings.newlinesduration) });
   break;
  case 'tempchannelban':
   ch.mod(msg, 'tempChannelBanAdd', {
    ...modOptions,
    duration: Number(settings.newlinesduration),
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
    duration: Number(settings.newlinesduration),
    deleteMessageSeconds:
     Number(settings.newlinesdeletemessageseconds) > 604800
      ? 604800
      : Number(settings.newlinesdeletemessageseconds),
   });
   break;
  case 'softban':
   ch.mod(msg, 'softBanAdd', {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.newlinesdeletemessageseconds) > 604800
      ? 604800
      : Number(settings.newlinesdeletemessageseconds),
   });
   break;
  default: {
   ch.mod(msg, 'softWarnAdd', {
    ...modOptions,
    reason: language.blacklist.warnNewlines(Number(settings.maxnewlines)),
   });
  }
 }
};

const invites = async (
 msg: Discord.Message<true>,
 settings: Prisma.blacklist,
 language: CT.Language,
) => {
 if (!settings.blockinvites) return;
 if (settings.inviteswlchannelid.includes(msg.channelId)) return;
 if (settings.inviteswlroleid.some((id) => msg.member?.roles.cache.has(id))) return;

 const hasInvite = await checkForInvite(msg.content);
 if (!hasInvite) return;

 if (msg.deletable) msg.delete().catch(() => undefined);

 const modOptions: CT.BaseOptions = {
  reason: language.blacklist.reasonInvite,
  guild: msg.guild,
  target: msg.author,
  executor: msg.client.user,
  dbOnly: false,
 };

 switch (settings.invitesaction) {
  case 'ban':
   ch.mod(msg, 'banAdd', {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.invitesdeletemessageseconds) > 604800
      ? 604800
      : Number(settings.invitesdeletemessageseconds),
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
   ch.mod(msg, 'tempMuteAdd', { ...modOptions, duration: Number(settings.invitesduration) });
   break;
  case 'tempchannelban':
   ch.mod(msg, 'tempChannelBanAdd', {
    ...modOptions,
    duration: Number(settings.invitesduration),
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
    duration: Number(settings.invitesduration),
    deleteMessageSeconds:
     Number(settings.invitesdeletemessageseconds) > 604800
      ? 604800
      : Number(settings.invitesdeletemessageseconds),
   });
   break;
  case 'softban':
   ch.mod(msg, 'softBanAdd', {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.invitesdeletemessageseconds) > 604800
      ? 604800
      : Number(settings.invitesdeletemessageseconds),
   });
   break;
  default: {
   ch.mod(msg, 'softWarnAdd', {
    ...modOptions,
    reason: language.blacklist.warnInvite,
   });
  }
 }
};

const checkForInvite = async (content: string): Promise<boolean> => {
 if (content.match(ch.regexes.inviteTester)) return true;
 if (!content.match(ch.regexes.urlTester(ch.cache.urlTLDs.toArray()))) return false;

 const args = content.split(/(\s+|\n+)/g);
 const argsContainingLink = args
  .filter((a) => a.includes('.'))
  .filter((arg) => arg.match(ch.regexes.urlTester(ch.cache.urlTLDs.toArray())));

 const results = await Promise.all(argsContainingLink.map((arg) => ch.fetchWithRedirects(arg)));
 if (results.some((r) => r.some((url) => url.match(ch.regexes.inviteTester)))) return true;

 return false;
};

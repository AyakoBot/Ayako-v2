import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (msg: Discord.Message<true>) => {
 const settings = await ch.DataBase.blacklist.findUnique({
  where: { guildid: msg.guildId, active: true },
 });
 if (!settings) return;

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

 const modOptions: CT.BaseOptions = {
  reason: language.blacklist.reasonNewlines,
  guild: msg.guild,
  target: msg.author,
  executor: msg.client.user,
  forceFinish: false,
  dbOnly: false,
 };

 switch (settings.newlinesaction) {
  case 'ban':
   ch.mod(msg, 'banAdd', modOptions);
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
   ch.doStrike(msg, msg.author, msg.guild, modOptions);
   break;
  case 'tempban':
   ch.mod(msg, 'tempBanAdd', { ...modOptions, duration: Number(settings.newlinesduration) });
   break;
  default: {
   ch.mod(msg, 'softWarnAdd', {
    ...modOptions,
    reason: language.blacklist.warnNewlines(Number(settings.maxnewlines)),
   });
  }
 }
};

const invites = (
 msg: Discord.Message<true>,
 settings: Prisma.blacklist,
 language: CT.Language,
) => {};

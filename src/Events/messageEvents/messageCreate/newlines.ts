import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (msg: Discord.Message<true>) => {
 if (msg.author.bot) return;
 if (msg.member?.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;

 const settings = await ch.DataBase.newlines.findUnique({
  where: { guildid: msg.guildId, active: true },
 });
 if (!settings) return;
 if (!settings.maxnewlines) return;
 if (settings.wlchannelid.includes(msg.channelId)) return;
 if (settings.wlroleid.some((id) => msg.member?.roles.cache.has(id))) return;

 const amountOfNewlines = msg.content.split('\n').length - 1;
 if (amountOfNewlines <= Number(settings.maxnewlines)) return;
 if (await ch.isDeleteable(msg)) ch.request.channels.deleteMessage(msg);

 const language = await ch.getLanguage(msg.guildId);

 const modOptions: CT.BaseOptions = {
  reason: language.censor.reasonNewlines,
  guild: msg.guild,
  target: msg.author,
  executor: msg.client.user,
  dbOnly: false,
  skipChecks: false,
 };

 switch (settings.action) {
  case 'ban':
   ch.mod(msg, CT.ModTypes.BanAdd, {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  case 'channelban':
   ch.mod(msg, CT.ModTypes.ChannelBanAdd, {
    ...modOptions,
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
   break;
  case 'kick':
   ch.mod(msg, CT.ModTypes.KickAdd, modOptions);
   break;
  case 'tempmute':
   ch.mod(msg, CT.ModTypes.TempMuteAdd, {
    ...modOptions,
    duration: Number(settings.duration),
   });
   break;
  case 'tempchannelban':
   ch.mod(msg, CT.ModTypes.TempChannelBanAdd, {
    ...modOptions,
    duration: Number(settings.duration),
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
   break;
  case 'warn':
   ch.mod(msg, CT.ModTypes.WarnAdd, modOptions);
   break;
  case 'strike':
   ch.mod(msg, CT.ModTypes.StrikeAdd, modOptions);
   break;
  case 'tempban':
   ch.mod(msg, CT.ModTypes.TempBanAdd, {
    ...modOptions,
    duration: Number(settings.duration),
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  case 'softban':
   ch.mod(msg, CT.ModTypes.SoftBanAdd, {
    ...modOptions,
    deleteMessageSeconds:
     Number(settings.deletemessageseconds) > 604800
      ? 604800
      : Number(settings.deletemessageseconds),
   });
   break;
  default: {
   ch.mod(msg, CT.ModTypes.SoftWarnAdd, {
    ...modOptions,
    reason: language.censor.warnNewlines(Number(settings.maxnewlines)),
   });
  }
 }
};

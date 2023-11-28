import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = await ch.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await ch.getLanguage(cmd.guildId);
 const lastMessage = cmd.channel
  ? cmd.channel.lastMessage ?? (await ch.request.channels.getMessages(cmd.channel, { limit: 1 }))
  : undefined;

 if (cmd.channel?.type === Discord.ChannelType.PrivateThread) {
  ch.request.channels.delete(cmd.guild, cmd.channelId);
 }

 if (!lastMessage || 'message' in lastMessage) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const emoteMessage = Array.isArray(lastMessage) ? lastMessage[0] : lastMessage;
 const emoteContent = emoteMessage?.author.bot ? undefined : emoteMessage?.content;

 const emote = emoteContent?.match(ch.regexes.emojiTester)?.length
  ? { identifier: emoteContent?.trim() }
  : { identifier: emoteContent?.replace(/<:/g, '').replace(/</g, '').replace(/>/g, '') };

 const updatedSetting = await ch.settingsHelpers.changeHelpers.getAndInsert(
  settingName,
  fieldName,
  cmd.guildId,
  emoteContent ? emote?.identifier : null,
  uniquetimestamp,
 );

 ch.settingsHelpers.updateLog(
  { [fieldName]: currentSetting?.[fieldName as keyof typeof currentSetting] },
  { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] },
  fieldName as Parameters<(typeof ch)['settingsHelpers']['updateLog']>[2],
  settingName,
  uniquetimestamp,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );
};

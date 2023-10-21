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

 const lastMessage = await cmd.channel?.messages.fetch({ limit: 1 }).catch(() => undefined);
 if (cmd.channel?.type === Discord.ChannelType.PrivateThread) {
  ch.request.channels.delete(cmd.guild, cmd.channelId);
 }
 if (!lastMessage) return;

 const emoteMessage = lastMessage.first();
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

 const language = await ch.getLanguage(cmd.guildId);

 ch.settingsHelpers.updateLog(
  { [fieldName]: currentSetting?.[fieldName as keyof typeof currentSetting] },
  { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] },
  fieldName as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
  settingName,
  uniquetimestamp,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );
};

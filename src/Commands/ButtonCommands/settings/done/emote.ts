import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import client from '../../../../BaseClient/Client.js';

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

 const emoteContent = lastMessage?.first()?.content;
 if (!emoteContent) return;

 const emoteID = emoteContent.replace(/\D+/g, '');
 const emote = emoteContent.match(ch.regexes.emojiTester)?.length
  ? { identifier: emoteContent.trim() }
  : (
     await client.shard?.broadcastEval((c, context) => c.emojis.cache.get(context) ?? null, {
      context: emoteID,
     })
    )?.find((e): e is Discord.Emoji => !!e);

 const updatedSetting = await ch.settingsHelpers.changeHelpers.getAndInsert(
  settingName,
  fieldName,
  cmd.guildId,
  emote?.identifier,
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

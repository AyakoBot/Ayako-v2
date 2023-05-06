import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';
import client from '../../../../BaseClient/Client.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 const settingName = args.shift() as keyof CT.TableNamesMap;
 if (!settingName) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const tableName = ch.constants.commands.settings.tableNames[
  settingName as keyof typeof ch.constants.commands.settings.tableNames
 ] as keyof CT.TableNamesMap;
 type SettingsType = CT.TableNamesMap[typeof tableName];

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = (await ch.settingsHelpers.changeHelpers.get(
  tableName,
  fieldName,
  cmd.guildId,
  uniquetimestamp,
 )) as SettingsType;

 const lastMessage = await cmd.channel?.messages.fetch({ limit: 1 }).catch(() => undefined);
 if (cmd.channel?.type === Discord.ChannelType.PrivateThread) {
  cmd.channel?.delete().catch(() => undefined);
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

 const updatedSetting = (await ch.settingsHelpers.changeHelpers.getAndInsert(
  tableName,
  fieldName,
  cmd.guildId,
  emote?.identifier,
  uniquetimestamp,
 )) as SettingsType;

 ch.settingsHelpers.updateLog(
  currentSetting,
  { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] },
  fieldName,
  settingName,
  uniquetimestamp,
 );
};

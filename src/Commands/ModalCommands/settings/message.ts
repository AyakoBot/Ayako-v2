import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const field = cmd.fields.fields.first();
 if (!field || !ch.regexes.messageTester.test(field.value)) {
  ch.errorCmd(cmd, language.t.errors.inputNoMatch, language);
  return;
 }

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const fieldName = field.customId;
 const newSetting = field.value.length ? field.value : null;

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

 const [, , , , channelid, msgid] = newSetting?.split(/\/+/g) ?? [];

 ch.settingsHelpers.changeHelpers
  .getAndInsert(settingName, 'channelid', cmd.guildId, channelid, uniquetimestamp)
  .then();

 ch.settingsHelpers.changeHelpers
  .getAndInsert(settingName, 'msgid', cmd.guildId, msgid, uniquetimestamp)
  .then();

 const updatedSetting = { ...currentSetting, msgid, channelid };

 ch.settingsHelpers.updateLog(
  { [fieldName]: currentSetting?.[fieldName as keyof typeof currentSetting] },
  updatedSetting,
  fieldName as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
  settingName,
  uniquetimestamp,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   updatedSetting as Parameters<(typeof settingsFile)['getEmbeds']>[1],
   language,
   language.slashCommands.settings.categories[settingName],
   cmd.guild,
  ),
  components: await settingsFile.getComponents(
   ch.settingsHelpers.buttonParsers,
   updatedSetting as Parameters<(typeof settingsFile)['getEmbeds']>[1],
   language,
  ),
 });
};

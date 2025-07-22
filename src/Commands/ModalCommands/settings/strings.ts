import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const field = cmd.fields.fields.first();
 if (!field) {
  cmd.client.util.errorCmd(cmd, language.errors.numNaN, language);
  return;
 }

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const fieldName = field.customId;
 const newSetting = field.value.split(/#/g).map((v) => v.trim());

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };

 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = await cmd.client.util.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const updatedSetting = await cmd.client.util.settingsHelpers.changeHelpers.getAndInsert(
  settingName,
  fieldName,
  cmd.guildId,
  newSetting,
  uniquetimestamp,
 );

 cmd.client.util.settingsHelpers.updateLog(
  { [fieldName]: currentSetting?.[fieldName as keyof typeof currentSetting] },
  { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] },
  fieldName as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  uniquetimestamp,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 cmd.client.util.settingsHelpers.showOverview(cmd, settingName, updatedSetting, language);
};

import {
 MessageFlags,
 type AnySelectMenuInteraction,
 type ButtonInteraction,
 type ModalMessageModalSubmitInteraction,
} from 'discord.js';
import type { SettingNames, SettingsName2TableName } from 'src/Typings/Settings';
import type { DataBaseTables, Language } from 'src/Typings/Typings';
import buttonParsers from './buttonParsers.js';
import componentParsers from './componentParsers.js';
import embedParsers from './embedParsers.js';
import getSettingsFile from './getSettingsFile.js';

export default async <K extends SettingNames>(
 cmd: ButtonInteraction | AnySelectMenuInteraction | ModalMessageModalSubmitInteraction,
 settingName: K,
 updatedSetting: DataBaseTables[(typeof SettingsName2TableName)[K]],
 language: Language,
) => {
 if (!cmd.inCachedGuild()) return;
 const settingsFile = await getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 if (settingsFile.getComponentsV2) {
  cmd.update({
   components: await settingsFile.getComponentsV2(
    embedParsers,
    buttonParsers,
    componentParsers,
    updatedSetting,
    language,
    language.slashCommands.settings.categories[settingName],
    cmd.guild,
   ),
   files: settingsFile.getFiles ? await settingsFile.getFiles(updatedSetting, language) : undefined,
   flags: MessageFlags.IsComponentsV2,
  });

  return;
 }

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   embedParsers,
   updatedSetting,
   language,
   language.slashCommands.settings.categories[settingName],
   cmd.guild,
  ),
  components: await settingsFile.getComponents(
   cmd.client.util.settingsHelpers.buttonParsers,
   updatedSetting,
   language,
  ),
  files: settingsFile.getFiles ? await settingsFile.getFiles(updatedSetting, language) : undefined,
 });
};

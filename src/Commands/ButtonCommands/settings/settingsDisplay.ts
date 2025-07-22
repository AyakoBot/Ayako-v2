import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const settingsFile = await cmd.client.util.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (settingsFile.showId && uniquetimestamp) {
  settingsFile.showId(
   cmd,
   uniquetimestamp.toString(36),
   language,
   language.slashCommands.settings.categories[settingName],
  );
  return;
 }

 if (settingsFile.showAll) {
  settingsFile.showAll(
   cmd,
   language,
   language.slashCommands.settings.categories[settingName as CT.SettingNames],
   0,
  );
  return;
 }

 const settings = await cmd.client.util.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  undefined,
 );
 if (!settings) {
  cmd.client.util.error(cmd.guild, new Error(`Setting not found ${settingName}`));
  return;
 }

 cmd.client.util.settingsHelpers.showOverview(cmd, settingName, settings, language);
};

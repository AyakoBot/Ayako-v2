import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
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

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await ch.getLanguage(cmd.guildId);

 if (settingsFile.showID && uniquetimestamp) {
  settingsFile.showID(
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
  );
  return;
 }

 const settings = await ch.settingsHelpers.changeHelpers.get(settingName, cmd.guildId, undefined);
 if (!settings) {
  ch.error(cmd.guild, new Error(`Setting not found ${settingName}`));
  return;
 }

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   settings,
   language,
   language.slashCommands.settings.categories[settingName],
   cmd.guild,
  ),
  components: await settingsFile.getComponents(
   ch.settingsHelpers.buttonParsers,
   settings,
   language,
  ),
 });
};

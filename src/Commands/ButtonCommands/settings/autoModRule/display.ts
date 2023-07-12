import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type CT from '../../../../Typings/CustomTypings.js';

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const tableName = ch.constants.commands.settings.tableNames[
  settingName as keyof typeof ch.constants.commands.settings.tableNames
 ] as keyof CT.TableNamesMap;

 const getID = () => {
  const arg = args.shift();
  if (arg) return arg;
  return undefined;
 };
 const id = getID();

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, tableName, cmd.guild);
 if (!settingsFile) return;

 const language = await ch.languageSelector(cmd.guildId);

 if (settingsFile.showID && id) {
  settingsFile.showID(cmd, id, language, language.slashCommands.settings.categories[settingName]);
  return;
 }

 if (settingsFile.showAll) {
  settingsFile.showAll(cmd, language, language.slashCommands.settings.categories[settingName]);
  return;
 }

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   id
    ? cmd.guild.autoModerationRules.cache.get(id)
    : cmd.guild.autoModerationRules.cache.map((o) => o),
   language,
   language.slashCommands.settings.categories[settingName],
  ),
  components: await settingsFile.getComponents(
   ch.settingsHelpers.buttonParsers,
   id
    ? cmd.guild.autoModerationRules.cache.get(id)
    : cmd.guild.autoModerationRules.cache.map((o) => o),
   language,
  ),
 });
};

import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../Typings/CustomTypings';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as keyof CT.TableNamesMap;
 if (!settingName) return;

 const tableName = ch.constants.commands.settings.tableNames[
  settingName as keyof typeof ch.constants.commands.settings.tableNames
 ] as keyof CT.TableNamesMap;

 const uniquetimestamp = Date.now();

 const currentSettings = await ch
  .query(
   `INSERT INTO ${tableName} (guildid, uniquetimestamp) VALUES ($1, $2);`,
   [cmd.guildId, uniquetimestamp],
   {
    returnType: 'unknown',
    asArray: false,
   },
  )
  .then(<T extends keyof CT.TableNamesMap>(r: unknown) => r as CT.TableNamesMap[T][]);

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, tableName, cmd.guild);
 if (!settingsFile) return;

 const language = await ch.languageSelector(cmd.guildId);

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   currentSettings,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
  components: await settingsFile.getComponents(
   ch.settingsHelpers.buttonParsers,
   currentSettings,
   language,
  ),
 });
};

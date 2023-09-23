import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const currentSettings = await ch.settingsHelpers
  .setup(settingName, cmd.guildId, Date.now())
  .then(<T extends keyof CT.TableNamesMap>(r: unknown) => r as CT.TableNamesMap[T]);

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await ch.getLanguage(cmd.guildId);

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   currentSettings,
   language,
   language.slashCommands.settings.categories[settingName],
   cmd.guild,
  ),
  components: await settingsFile.getComponents(
   ch.settingsHelpers.buttonParsers,
   currentSettings,
   language,
  ),
 });
};

import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const settings = await ch.settingsHelpers.changeHelpers.get(settingName, cmd.guildId, undefined);

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await ch.languageSelector(cmd.guildId);

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
   language.slashCommands.settings.categories[
    settingName as keyof CT.Language['slashCommands']['settings']['categories']
   ],
  );
  return;
 }

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   settings,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
  components: await settingsFile.getComponents(
   ch.settingsHelpers.buttonParsers,
   settings,
   language,
  ),
 });
};

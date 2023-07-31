import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const uniquetimestamp = Number(args.shift());

 const oldSettings = await ch.settingsHelpers.del(settingName, cmd.guildId, uniquetimestamp);

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.settings.categories[settingName];

 ch.settingsHelpers.updateLog(
  oldSettings,
  undefined,
  '*' as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
  settingName,
  uniquetimestamp,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 settingsFile.showAll?.(cmd, language, lan);
};

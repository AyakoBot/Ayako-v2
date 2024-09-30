import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const uniquetimestamp = Number(args.shift());

 const oldSettings = await cmd.client.util.settingsHelpers.del(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const settingsFile = await cmd.client.util.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.settings.categories[settingName];

 cmd.client.util.settingsHelpers.updateLog(
  oldSettings,
  undefined,
  '*' as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  uniquetimestamp,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 settingsFile.showAll?.(cmd, language, lan, 0);
};

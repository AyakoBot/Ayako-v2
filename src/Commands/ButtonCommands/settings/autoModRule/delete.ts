import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const id = args.shift();
 if (!id) {
  ch.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await ch.languageSelector(cmd.guildId);
 const oldSettings = JSON.parse(JSON.stringify(cmd.guild.autoModerationRules.cache.get(id)));
 const error = await cmd.guild.autoModerationRules.cache
  .get(id)
  ?.delete()
  .catch((e) => e as Discord.DiscordAPIError);

 if (error) {
  ch.errorCmd(cmd, error.message, language);
  return;
 }

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) {
  ch.error(cmd.guild, new Error('SettingsFile not found'));
  return;
 }

 const lan =
  language.slashCommands.settings.categories[
   settingName as keyof CT.Language['slashCommands']['settings']['categories']
  ];

 ch.settingsHelpers.updateLog(
  oldSettings as never,
  undefined,
  '*' as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 settingsFile.showAll?.(cmd, language, lan as never);
};

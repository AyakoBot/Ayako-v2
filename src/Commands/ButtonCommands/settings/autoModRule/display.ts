import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const getId = () => {
  const arg = args.shift();
  if (arg) return arg;
  return undefined;
 };
 const id = getId();

 const settingsFile = await cmd.client.util.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (settingsFile.showId && id) {
  settingsFile.showId(
   cmd,
   id,
   language,
   language.slashCommands.settings.categories[settingName as CT.SettingNames] as never,
  );
  return;
 }

 if (settingsFile.showAll) {
  settingsFile.showAll(
   cmd,
   language,
   language.slashCommands.settings.categories[settingName as CT.SettingNames] as never,
  );
  return;
 }

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   cmd.client.util.settingsHelpers.embedParsers,
   (id
    ? cmd.guild.autoModerationRules.cache.get(id)
    : cmd.guild.autoModerationRules.cache.map((o) => o)) as never,
   language,
   language.slashCommands.settings.categories[settingName],
   cmd.guild,
  ),
  components: await settingsFile.getComponents(
   cmd.client.util.settingsHelpers.buttonParsers,
   (id
    ? cmd.guild.autoModerationRules.cache.get(id)
    : cmd.guild.autoModerationRules.cache.map((o) => o)) as never,
   language,
  ),
 });
};

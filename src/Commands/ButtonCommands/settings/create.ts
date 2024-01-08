import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const currentSettings = await cmd.client.util.settingsHelpers
  .setup(settingName, cmd.guildId, Date.now())
  .then(
   <T extends keyof typeof CT.SettingsName2TableName>(r: unknown) =>
    r as CT.DataBaseTables[(typeof CT.SettingsName2TableName)[T]],
  );

 const settingsFile = await cmd.client.util.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   cmd.client.util.settingsHelpers.embedParsers,
   currentSettings,
   language,
   language.slashCommands.settings.categories[settingName],
   cmd.guild,
  ),
  components: await settingsFile.getComponents(
   cmd.client.util.settingsHelpers.buttonParsers,
   currentSettings,
   language,
  ),
 });
};

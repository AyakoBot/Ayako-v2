import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.client.util.settingsHelpers.permissionCheck(cmd)) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const currentSettings = await cmd.client.util.settingsHelpers
  .setup(settingName, cmd.guildId, Date.now())
  .then(
   <T extends keyof typeof CT.SettingsName2TableName>(r: unknown) =>
    r as CT.DataBaseTables[(typeof CT.SettingsName2TableName)[T]],
  );

 cmd.client.util.settingsHelpers.showOverview(
  cmd,
  settingName,
  currentSettings,
  await cmd.client.util.getLanguage(cmd.guildId),
 );
};

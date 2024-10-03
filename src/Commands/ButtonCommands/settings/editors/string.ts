import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.client.util.settingsHelpers.permissionCheck(cmd)) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = await cmd.client.util.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.showModal(
  cmd.client.util.settingsHelpers.changeHelpers.changeModal(
   language,
   settingName,
   fieldName,
   'string',
   currentSetting?.[fieldName as keyof typeof currentSetting],
   false,
   uniquetimestamp,
  ),
 );
};

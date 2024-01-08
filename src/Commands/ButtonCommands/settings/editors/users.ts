import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

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

 const currentSettings = await cmd.client.util.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const currentSetting = currentSettings?.[fieldName as keyof typeof currentSettings] as
  | string
  | string[];

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 cmd.update({
  embeds: [
   await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    currentSettings?.[fieldName as keyof typeof currentSettings],
    CT.EditorTypes.User,
    cmd.guild,
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.changeHelpers.changeSelectGlobal(
      language,
      CT.EditorTypes.Users,
      fieldName,
      settingName,
      uniquetimestamp,
      (Array.isArray(currentSetting) ? currentSetting : [currentSetting]).map((o) => ({
       id: o,
       type: Discord.SelectMenuDefaultValueType.Channel,
      })),
      cmd.guild,
     ),
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp)),
     cmd.client.util.settingsHelpers.changeHelpers.done(
      settingName,
      fieldName,
      CT.EditorTypes.Users,
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};

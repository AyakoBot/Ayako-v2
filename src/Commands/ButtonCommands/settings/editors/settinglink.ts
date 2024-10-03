import * as Discord from 'discord.js';
import { glob } from 'glob';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.client.util.settingsHelpers.permissionCheck(cmd)) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const linkedSettingName = args.shift() as CT.SettingNames;
 if (!linkedSettingName) return;

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

 const settingsFiles = await glob(
  `${process.cwd()}${
   process.cwd().includes('dist') ? '' : '/dist'
  }/Commands/AutocompleteCommands/settings/**/*`,
 );

 const settingsFile = settingsFiles.find((f) =>
  f.endsWith(
   `/${
    cmd.client.util.constants.commands.settings.basicSettings.includes(linkedSettingName)
     ? `${linkedSettingName}/basic`
     : linkedSettingName
   }.js`,
  ),
 );
 if (!settingsFile) return;

 const linkedSetting = (await import(settingsFile)) as CT.AutoCompleteFile;
 const responses = await linkedSetting.default({ guild: cmd.guild });
 const options = responses?.map((r) => ({
  label: r.name,
  value: r.value,
  default: r.value === currentSetting?.[fieldName as keyof typeof currentSetting],
 }));

 cmd.update({
  embeds: [
   await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    CT.EditorTypes.SettingLink,
    cmd.guild,
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.changeHelpers.changeSelect(
      fieldName,
      settingName,
      CT.EditorTypes.SettingLink,
      {
       options: options?.length ? options : [{ label: '-', value: '-' }],
       disabled: !options?.length,
      },
      uniquetimestamp,
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
      CT.EditorTypes.SettingLink,
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};

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

 const currentSetting = await cmd.client.util.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const embed = await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
  language,
  settingName,
  fieldName,
  currentSetting?.[fieldName as keyof typeof currentSetting],
  CT.EditorTypes.Channel,
  cmd.guild,
 );

 delete embed.description;
 delete embed.title;

 cmd.update({
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp)),
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Success,
      custom_id: `settings/editors/string_${fieldName}_${settingName}_${uniquetimestamp}`,
      label: (
       language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
        string,
        string
       >
      )?.name,
     },
    ],
   },
  ],
 });
};

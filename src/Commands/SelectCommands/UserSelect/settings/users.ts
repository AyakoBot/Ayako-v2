import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (
 cmd: Discord.UserSelectMenuInteraction | Discord.ModalMessageModalSubmitInteraction,
 args: string[],
 single: boolean = false,
) => {
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

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const values =
  cmd instanceof Discord.UserSelectMenuInteraction
   ? cmd.users.map((u) => u.id)
   : cmd.fields
      .getTextInputValue(fieldName)
      .split(/,\s*|\s+/g)
      .map((v) => v.trim());

 cmd.update({
  embeds: [
   await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    values,
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
      single ? CT.EditorTypes.User : CT.EditorTypes.Users,
      fieldName,
      settingName,
      uniquetimestamp,
      (Array.isArray(values) ? values : [values]).map((o) => ({
       id: o,
       type: Discord.SelectMenuDefaultValueType.User,
      })),
     ),
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp)),
     cmd.client.util.settingsHelpers.changeHelpers.changeButtonUsers(
      language,
      settingName,
      fieldName,
      cmd.client,
      uniquetimestamp,
     ),
     cmd.client.util.settingsHelpers.changeHelpers.done(
      settingName,
      fieldName,
      single ? CT.EditorTypes.User : CT.EditorTypes.Users,
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};

import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Settings.js';

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
  cmd.client,
 );

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const embeds = await cmd.client.util.DataBase.customembeds.findMany({
  where: { guildid: cmd.guildId },
 });

 cmd.update({
  embeds: [
   await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    cmd.client.util.CT.EditorTypes.Embed,
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
      cmd.client.util.CT.EditorTypes.Embed,
      {
       options: embeds.length
        ? embeds.map((e) => ({
           label: e.name,
           value: e.uniquetimestamp.toString(),
           default:
            e.uniquetimestamp.toString() ===
            currentSetting?.[fieldName as keyof typeof currentSetting],
          }))
        : [{ label: '-', value: '-' }],
       disabled: !embeds?.length,
      },
      uniquetimestamp,
     ),
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.changeHelpers.back(
      settingName,
      Number(uniquetimestamp),
      cmd.client,
     ),
     cmd.client.util.settingsHelpers.changeHelpers.done(
      settingName,
      fieldName,
      cmd.client.util.CT.EditorTypes.Embed,
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};

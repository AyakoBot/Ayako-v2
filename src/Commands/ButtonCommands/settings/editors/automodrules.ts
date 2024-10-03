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
 cmd.update({
  embeds: [
   await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    CT.EditorTypes.AutoModRules,
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
      CT.EditorTypes.AutoModRules,
      {
       options:
        cmd.guild?.autoModerationRules.cache
         .filter((c) => c.eventType === Discord.AutoModerationRuleEventType.MessageSend)
         .map((c) => ({
          label: c.name,
          value: c.id,
          default: c.id === currentSetting?.[fieldName as keyof typeof currentSetting],
         })) ?? [],
       disabled: !cmd.guild?.autoModerationRules.cache.filter(
        (c) => c.eventType === Discord.AutoModerationRuleEventType.MessageSend,
       ).size,
       max_values: cmd.guild?.autoModerationRules.cache.filter(
        (c) => c.eventType === Discord.AutoModerationRuleEventType.MessageSend,
       ).size,
       min_values: 1,
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
      CT.EditorTypes.AutoModRules,
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};

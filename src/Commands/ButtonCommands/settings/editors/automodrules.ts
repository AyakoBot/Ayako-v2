import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = await ch.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await ch.getLanguage(cmd.guildId);
 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    'automodrules',
    cmd.guild,
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     ch.settingsHelpers.changeHelpers.changeSelect(
      fieldName,
      settingName,
      'automodrules',
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
     ch.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp)),
     ch.settingsHelpers.changeHelpers.done(
      settingName,
      fieldName,
      'automodrules',
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};

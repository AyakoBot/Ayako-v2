import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const getID = () => {
  const arg = args.shift();
  if (arg) return arg;
  return undefined;
 };
 const id = getID();
 if (!id) {
  ch.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await ch.getLanguage(cmd.guildId);
 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  ch.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 const currentSetting = rule.actions.find(
  (r) => r.type === Discord.AutoModerationActionType.SendAlertMessage,
 )?.metadata.channelId;

 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    'alertChannel',
    rule.actions.find((r) => r.type === Discord.AutoModerationActionType.SendAlertMessage)?.metadata
     .channelId || undefined,
    CT.EditorTypes.Channel,
    cmd.guild,
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     ch.settingsHelpers.changeHelpers.changeSelectGlobal(
      language,
      CT.EditorTypes.Channel,
      CT.AutoModEditorType.Channel,
      settingName,
      id,
      currentSetting
       ? [
          {
           id: currentSetting,
           type: Discord.SelectMenuDefaultValueType.Channel,
          },
         ]
       : [],
     ),
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Danger,
      custom_id: `settings/autoModRule/display_${id}`,
      emoji: ch.emotes.back,
     },
     ch.settingsHelpers.changeHelpers.done(
      settingName,
      CT.EditorTypes.Channel,
      CT.AutoModEditorType.Channel,
      language,
      id,
     ),
    ],
   },
  ],
 });
};

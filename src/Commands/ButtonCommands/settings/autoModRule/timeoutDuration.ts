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
  (a) => a.type === Discord.AutoModerationActionType.Timeout,
 )?.metadata.durationSeconds;

 cmd.showModal(
  ch.settingsHelpers.changeHelpers.changeModal(
   language,
   settingName,
   'timeoutDuration',
   'autoModRule/duration',
   currentSetting ? String(currentSetting) : undefined,
   true,
   id,
  ),
 );
};

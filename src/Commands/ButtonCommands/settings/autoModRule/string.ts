import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 // only one type of argument exists
 args.shift();

 const getID = () => {
  const arg = args.shift();
  if (arg) return arg;
  return undefined;
 };
 const id = getID();
 if (!id) {
  cmd.client.util.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  cmd.client.util.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 cmd.showModal(
  cmd.client.util.settingsHelpers.changeHelpers.changeModal(
   language,
   settingName,
   'customMessage',
   'autoModRule/string',
   rule.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage)?.metadata
    .customMessage || '',
   true,
   id,
  ),
 );
};

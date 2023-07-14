import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

const settingName = 'blacklist-rules';

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
  ch.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  ch.error(cmd.guild, new Error('Rule not found'));
  return;
 }

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.settings.categories[settingName];

 cmd.showModal(
  ch.settingsHelpers.changeHelpers.changeModal(
   language,
   lan,
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

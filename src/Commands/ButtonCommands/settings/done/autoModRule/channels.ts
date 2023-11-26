import * as Discord from 'discord.js';
import * as ch from '../../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../../SlashCommands/settings/moderation/denylist-rules.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

const settingName = 'denylist-rules';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const getID = () => {
  const arg = args.pop();
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

 const oldSetting = structuredClone(rule.exemptChannels.map((o) => o.id));
 const channelText = cmd.message.embeds[0].description?.split(/,\s/g);
 const channelIDs =
  channelText?.map((c) => c.replace(/\D/g, '') || undefined).filter((c): c is string => !!c) ?? [];

 const updatedRule = await ch.request.guilds.editAutoModerationRule(cmd.guild, rule.id, {
  exempt_channels: channelIDs,
 });

 if ('message' in updatedRule) {
  ch.errorCmd(cmd, updatedRule, language);
  return;
 }

 ch.settingsHelpers.updateLog(
  { exemptChannels: channelIDs } as never,
  { exemptChannels: oldSetting } as never,
  'exemptChannels' as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 const settingsFile = (await ch.settingsHelpers.getSettingsFile(
  settingName,
  cmd.guild,
 )) as unknown as typeof SettingsFile;
 if (!settingsFile) return;

 cmd.update({
  embeds: settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   updatedRule,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
  components: settingsFile.getComponents(
   updatedRule,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
 });
};

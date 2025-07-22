import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const getId = () => {
  const arg = args.pop();
  if (arg) return arg;
  return undefined;
 };
 const id = getId();
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

 const oldSetting = structuredClone(rule.exemptChannels.map((o) => o.id));
 const channelText = cmd.message.embeds[0].description?.split(/,\s/g);
 const channelIds =
  channelText?.map((c) => c.replace(/\D/g, '') || undefined).filter((c): c is string => !!c) ?? [];

 const updatedRule = await cmd.client.util.request.guilds.editAutoModerationRule(
  cmd.guild,
  rule.id,
  {
   exempt_channels: channelIds,
  },
 );

 if ('message' in updatedRule) {
  cmd.client.util.errorCmd(cmd, updatedRule, language);
  return;
 }

 cmd.client.util.settingsHelpers.updateLog(
  { exemptChannels: channelIds } as never,
  { exemptChannels: oldSetting } as never,
  'exemptChannels' as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 // @ts-expect-error Error overwrite for automod rules
 cmd.client.util.settingsHelpers.showOverview(cmd, settingName, updatedRule, language);
};

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

 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    'exemptRoles',
    rule.exemptRoles.map((c) => c.id),
    CT.EditorTypes.Role,
    cmd.guild,
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     ch.settingsHelpers.changeHelpers.changeSelectGlobal(
      language,
      CT.EditorTypes.Roles,
      CT.AutoModEditorType.Roles,
      settingName,
      id,
      rule.exemptRoles
       .map((c) => c.id)
       .map((o) => ({ id: o, type: Discord.SelectMenuDefaultValueType.Role })),
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
      'role',
      CT.AutoModEditorType.Roles,
      language,
      id,
     ),
     ch.settingsHelpers.changeHelpers.makeEmpty(
      settingName,
      'exemptRoles',
      'autoModRule/array',
      language,
      id,
     ),
    ],
   },
  ],
 });
};

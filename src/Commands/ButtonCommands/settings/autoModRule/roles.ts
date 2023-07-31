import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

const settingName = 'blacklist-rules';

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

 const language = await ch.languageSelector(cmd.guildId);
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
    'role',
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     ch.settingsHelpers.changeHelpers.changeSelectGlobal(
      language,
      'roles',
      'autoModRule/roles',
      settingName,
      id,
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
      emoji: ch.objectEmotes.back,
     },
     ch.settingsHelpers.changeHelpers.done(settingName, 'role', 'autoModRule/roles', language, id),
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

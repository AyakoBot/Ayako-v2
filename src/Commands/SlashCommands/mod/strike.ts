import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import getStrike from '../../../BaseClient/ClientHelperModules/mod/getStrike.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const strike = await ch.DataBase.autopunish.findFirst({
  where: { guildid: cmd.guildId, active: true },
 });

 const language = await ch.getLanguage(cmd.guildId);

 if (!strike) {
  ch.errorCmd(
   cmd,
   language.slashCommands.moderation.strike.notEnabled(
    (await ch.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0',
   ),
   language,
  );
  return;
 }

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);

 const modOptions: CT.ModOptions<'strikeAdd'> = {
  reason: reason ?? language.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  skipChecks: false,
 };

 ch.mod(cmd, 'strikeAdd', modOptions);

 const applyingStrike = await getStrike(user, cmd.guild);
 const member = cmd.options.getMember('user');

 if (!member) return;

 if (applyingStrike?.addroles) {
  ch.roleManager.add(member, applyingStrike.addroles, language.autotypes.autopunish, 1);
 }

 if (applyingStrike?.removeroles) {
  ch.roleManager.remove(member, applyingStrike.removeroles, language.autotypes.autopunish, 1);
 }
};

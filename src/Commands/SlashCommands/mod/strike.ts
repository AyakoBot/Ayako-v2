import * as Discord from 'discord.js';
import getStrike from '../../../BaseClient/UtilModules/mod/getStrike.js';
import * as CT from '../../../Typings/Typings.js';
import { isBlocked } from './ban.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const strike = await cmd.client.util.DataBase.autopunish.findFirst({
  where: { guildid: cmd.guildId, active: true },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (!strike) {
  cmd.client.util.errorCmd(
   cmd,
   language.slashCommands.moderation.strike.notEnabled(
    (await cmd.client.util.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0',
   ),
   language,
  );
  return;
 }

 const user = cmd.options.getUser('user', true);
 if (await isBlocked(cmd, user, CT.ModTypes.StrikeAdd, language)) return;
 const reason = cmd.options.getString('reason', false);

 const modOptions: CT.ModOptions<CT.ModTypes.StrikeAdd> = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  skipChecks: false,
 };

 cmd.client.util.mod(cmd, CT.ModTypes.StrikeAdd, modOptions);

 const applyingStrike = await getStrike(user, cmd.guild);
 const member = cmd.options.getMember('user');

 if (!member) return;

 if (applyingStrike?.addroles) {
  cmd.client.util.roleManager.add(
   member,
   applyingStrike.addroles,
   language.autotypes.autopunish,
   1,
  );
 }

 if (applyingStrike?.removeroles) {
  cmd.client.util.roleManager.remove(
   member,
   applyingStrike.removeroles,
   language.autotypes.autopunish,
   1,
  );
 }
};

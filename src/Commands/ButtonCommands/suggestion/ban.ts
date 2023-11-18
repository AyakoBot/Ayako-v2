import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;
 const suggestion = await ch.DataBase.suggestionvotes.findUnique({
  where: { msgid: cmd.message.id },
 });
 if (!suggestion) {
  ch.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const settings = await ch.DataBase.suggestionsettings.update({
  where: {
   guildid: cmd.guildId,
   active: true,
   approverroleid: { hasSome: cmd.member.roles.cache.map((r) => r.id) },
   NOT: { nosendusers: { has: cmd.user.id } },
  },
  data: {
   nosendusers: { push: cmd.user.id },
  },
  select: {
   active: true,
  },
 });

 if (!settings?.active) {
  ch.errorCmd(
   cmd,
   lan.cantBan((await ch.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0'),
   language,
  );
  return;
 }

 const user = await ch.getUser(suggestion.userid);
 if (!user) {
  ch.errorCmd(cmd, language.t.errors.userNotExist, language);
  return;
 }

 ch.replyCmd(cmd, { content: lan.banned(user) });
};

import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;
 const suggestion = await cmd.client.util.DataBase.suggestionvotes.findUnique({
  where: { msgid: cmd.message.id },
 });
 if (!suggestion) {
  cmd.client.util.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const settings = await cmd.client.util.DataBase.suggestionsettings.update({
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
  cmd.client.util.errorCmd(
   cmd,
   lan.cantBan((await cmd.client.util.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0'),
   language,
  );
  return;
 }

 const user = await cmd.client.util.getUser(suggestion.userid);
 if (!user) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotExist, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.banned(user) });
};

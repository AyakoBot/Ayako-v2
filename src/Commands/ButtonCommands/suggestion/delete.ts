import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const valid = await isValid(cmd);
 if (!valid) return;

 await cmd.deferUpdate();
 if (await cmd.client.util.isDeleteable(cmd.message)) {
  cmd.client.util.request.channels.deleteMessage(cmd.message);
 }
 cmd.client.util.DataBase.suggestionvotes.delete({ where: { msgid: cmd.message.id } }).then();
};

const isValid = async (cmd: Discord.ButtonInteraction<'cached'>) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;

 const settings = await cmd.client.util.DataBase.suggestionsettings.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });

 const suggestion = await cmd.client.util.DataBase.suggestionvotes.findUnique({
  where: { msgid: cmd.message.id, userid: cmd.user.id },
 });

 if (
  suggestion?.userid !== cmd.user.id ||
  !cmd.member.roles.cache.hasAny(...(settings?.approverroleid ?? []))
 ) {
  cmd.client.util.errorCmd(cmd, lan.notOwner, language);
  return false;
 }

 return true;
};

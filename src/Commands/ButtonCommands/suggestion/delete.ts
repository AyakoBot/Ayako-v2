import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const valid = await isValid(cmd);
 if (!valid) return;

 await cmd.deferUpdate();
 if (await ch.isDeleteable(cmd.message)) ch.request.channels.deleteMessage(cmd.message);
 ch.DataBase.suggestionvotes.delete({ where: { msgid: cmd.message.id } }).then();
};

const isValid = async (cmd: Discord.ButtonInteraction<'cached'>) => {
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;

 const settings = await ch.DataBase.suggestionsettings.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });

 const suggestion = await ch.DataBase.suggestionvotes.findUnique({
  where: { msgid: cmd.message.id, userid: cmd.user.id },
 });

 if (
  suggestion?.userid !== cmd.user.id ||
  !cmd.member.roles.cache.hasAny(...(settings?.approverroleid ?? []))
 ) {
  ch.errorCmd(cmd, lan.notOwner, language);
  return false;
 }

 return true;
};

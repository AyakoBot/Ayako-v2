import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', false) ?? cmd.user;

 const bal = await ch.DataBase.balance.findUnique({
  where: {
   userid_guildid: {
    userid: user.id,
    guildid: cmd.guildId,
   },
  },
 });

 const settings = await ch.DataBase.shop.findUnique({
  where: { guildid: cmd.guildId },
 });

 const language = await ch.getLanguage(cmd.guildId);
 const emote = ch.constants.standard.getEmote(
  settings?.currencyemote
   ? Discord.parseEmoji(settings.currencyemote) ?? ch.emotes.book
   : ch.emotes.book,
 );

 ch.replyCmd(cmd, {
  content: `> ${bal?.balance ?? 0} ${emote}\n${language.slashCommands.balance.how2Earn(emote)}`,
 });
};

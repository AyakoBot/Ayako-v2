import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', false) ?? cmd.user;

 const bal = await cmd.client.util.DataBase.balance.findUnique({
  where: {
   userid_guildid: {
    userid: user.id,
    guildid: cmd.guildId,
   },
  },
 });

 const settings = await cmd.client.util.DataBase.shop.findUnique({
  where: { guildid: cmd.guildId },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const emote = cmd.client.util.constants.standard.getEmote(
  settings?.currencyemote
   ? Discord.parseEmoji(settings.currencyemote) ?? cmd.client.util.emotes.book
   : cmd.client.util.emotes.book,
 );

 cmd.client.util.replyCmd(cmd, {
  content: `> ${bal?.balance ?? 0} ${emote}\n${language.slashCommands.balance.how2Earn(emote)}`,
 });
};

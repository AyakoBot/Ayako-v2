import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true).replace(/[^a-zA-Z0-9_]/g, '');
 const rawEmoji = cmd.options.getString('emoji', true);
 const emoji = Discord.parseEmoji(rawEmoji);
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.emojis;

 if (ch.regexes.emojiTester.test(rawEmoji) || !emoji) {
  ch.errorCmd(cmd, language.errors.invalidEmote, await ch.languageSelector(cmd.guildId));
  return;
 }

 const res = await cmd.guild.emojis
  .create({
   name,
   attachment: ch.constants.standard.emoteURL(emoji as Discord.Emoji),
   reason: lan.createReason(cmd.user),
  })
  .catch((err) => err as Discord.DiscordAPIError);

 if (res instanceof Discord.GuildEmoji) {
  ch.replyCmd(cmd, { content: lan.created(res) });
  return;
 }

 ch.errorCmd(cmd, res.message, language);
};

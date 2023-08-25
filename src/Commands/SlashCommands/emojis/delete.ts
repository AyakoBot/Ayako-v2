import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.emojis;

 const rawEmoji = Discord.parseEmoji(cmd.options.getString('emoji', true));
 const emoji = rawEmoji?.id ? cmd.guild.emojis.cache.get(rawEmoji.id) : undefined;

 if (!emoji) {
  ch.errorCmd(cmd, language.errors.emoteNotFound, await ch.languageSelector(cmd.guildId));
  return;
 }

 const res = await ch.request.guilds.deleteEmoji(cmd.guild, emoji.id, lan.deleteReason(cmd.user));

 if (res && 'message' in res) {
  ch.errorCmd(cmd, res.message, language);
  return;
 }

 ch.replyCmd(cmd, { content: lan.deleted(emoji) });
};

import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.emojis;

 const rawEmoji = Discord.parseEmoji(cmd.options.getString('emoji', true));
 const emoji = rawEmoji?.id ? cmd.guild.emojis.cache.get(rawEmoji.id) : undefined;

 if (!emoji) {
  cmd.client.util.errorCmd(
   cmd,
   language.errors.emoteNotFound,
   await cmd.client.util.getLanguage(cmd.guildId),
  );
  return;
 }

 const res = await cmd.client.util.request.guilds.deleteEmoji(
  cmd.guild,
  emoji.id,
  lan.deleteReason(cmd.user),
 );

 if (res && 'message' in res) {
  cmd.client.util.errorCmd(cmd, res, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.deleted(emoji) });
};

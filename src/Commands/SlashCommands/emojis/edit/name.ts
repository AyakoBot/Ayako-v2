import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true).replace(/[^a-zA-Z0-9_]/g, '');
 const rawEmoji = Discord.parseEmoji(cmd.options.getString('emoji', true));
 const emoji = rawEmoji?.id ? cmd.guild.emojis.cache.get(rawEmoji.id) : undefined;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.emojis;

 if (!emoji) {
  cmd.client.util.errorCmd(
   cmd,
   language.errors.emoteNotFound,
   await cmd.client.util.getLanguage(cmd.guildId),
  );
  return;
 }

 const editedEmote = await cmd.client.util.request.guilds.editEmoji(
  cmd.guild,
  emoji.id,
  { name },
  lan.editReason(cmd.user),
 );

 if ('message' in editedEmote) {
  cmd.client.util.errorCmd(cmd, editedEmote, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.edited(editedEmote) });
};

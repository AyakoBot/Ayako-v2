import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const stickerIDorName = cmd.options.getString('sticker', true);
 const sticker = cmd.guild.stickers.cache.find(
  (s) => s.id === stickerIDorName || s.name === stickerIDorName,
 );
 if (!sticker) {
  cmd.client.util.errorCmd(cmd, language.errors.stickerNotFound, language);
  return;
 }

 const lan = language.slashCommands.stickers;

 const del = await cmd.client.util.request.guilds.deleteSticker(
  cmd.guild,
  sticker.id,
  lan.deleteReason(cmd.user),
 );

 if (del && 'message' in del) {
  cmd.client.util.errorCmd(cmd, del.message, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  content: lan.deleted(sticker),
 });
};

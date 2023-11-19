import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const stickerIDorName = cmd.options.getString('sticker', true);
 const sticker = cmd.guild.stickers.cache.find(
  (s) => s.id === stickerIDorName || s.name === stickerIDorName,
 );
 if (!sticker) {
  ch.errorCmd(cmd, language.t.errors.stickerNotFound, language);
  return;
 }

 const lan = language.slashCommands.stickers;

 const del = await ch.request.guilds.deleteSticker(
  cmd.guild,
  sticker.id,
  lan.deleteReason(cmd.user),
 );

 if (del && 'message' in del) {
  ch.errorCmd(cmd, del.message, language);
  return;
 }

 ch.replyCmd(cmd, {
  content: lan.deleted(sticker),
 });
};

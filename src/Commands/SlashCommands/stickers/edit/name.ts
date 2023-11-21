import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const stickerIDorName = cmd.options.getString('sticker', true);
 const name = cmd.options.getString('name', true);

 const sticker = cmd.guild.stickers.cache.find(
  (s) => s.name === stickerIDorName || s.id === stickerIDorName,
 );
 if (!sticker) {
  ch.errorCmd(cmd, language.errors.stickerNotFound, language);
  return;
 }

 const lan = language.slashCommands.stickers;

 const updated = await ch.request.guilds.editSticker(
  cmd.guild,
  sticker.id,
  {
   name,
  },
  lan.editReason(cmd.user),
 );

 if ('message' in updated) {
  ch.errorCmd(cmd, updated.message, language);
  return;
 }

 ch.replyCmd(cmd, {
  content: language.slashCommands.stickers.edited(updated),
 });
};

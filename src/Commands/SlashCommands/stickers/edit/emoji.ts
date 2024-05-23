import * as Discord from 'discord.js';
import Emojis from '../../../../BaseClient/Other/Emojis.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const stickerIdOrName = cmd.options.getString('sticker', true);
 const emoji = cmd.options.getString('emoji', true);

 const selectedEmoji = Emojis.find((e) => e === emoji.replace(/:/g, ''));
 if (!selectedEmoji) {
  cmd.client.util.errorCmd(cmd, language.errors.emoteNotFound, language);
  return;
 }

 const sticker = cmd.guild.stickers.cache.find(
  (s) => s.name === stickerIdOrName || s.id === stickerIdOrName,
 );
 if (!sticker) {
  cmd.client.util.errorCmd(cmd, language.errors.stickerNotFound, language);
  return;
 }

 const lan = language.slashCommands.stickers;

 const updated = await cmd.client.util.request.guilds.editSticker(
  cmd.guild,
  sticker.id,
  {
   tags: selectedEmoji,
  },
  lan.editReason(cmd.user),
 );

 if ('message' in updated) {
  cmd.client.util.errorCmd(cmd, updated.message, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  content: language.slashCommands.stickers.edited(updated),
 });
};

import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction<'cached'>,
 _args: string[],
 type: 'name' | 'desc' = 'desc',
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const stickerIDorName = cmd.options.getString('sticker', true);
 const val = cmd.options.getString(type === 'desc' ? 'description' : 'name', true);

 const sticker = cmd.guild.stickers.cache.find(
  (s) => s.name === stickerIDorName || s.id === stickerIDorName,
 );
 if (!sticker) {
  ch.errorCmd(cmd, language.t.errors.stickerNotFound, language);
  return;
 }

 const lan = language.slashCommands.stickers;

 const updated = await ch.request.guilds.editSticker(
  cmd.guild,
  sticker.id,
  type === 'desc' ? { description: val } : { name: val },
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

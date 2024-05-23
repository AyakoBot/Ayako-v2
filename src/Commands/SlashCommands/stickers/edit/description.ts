import * as Discord from 'discord.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction<'cached'>,
 _args: string[],
 type: 'name' | 'desc' = 'desc',
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const stickerIdOrName = cmd.options.getString('sticker', true);
 const val = cmd.options.getString(type === 'desc' ? 'description' : 'name', true);

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
  type === 'desc' ? { description: val } : { name: val },
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

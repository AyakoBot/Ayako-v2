import * as Discord from 'discord.js';
import Emojis from '../../../../BaseClient/Other/Emojis.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const messageLink = cmd.options.getString('link', true);
 const name = cmd.options.getString('name', true);
 const description = cmd.options.getString('description', true);
 const emoji = cmd.options.getString('emoji', true);
 const stickerName = cmd.options.getString('sticker-name', false);

 const selectedEmoji = Emojis.find((e) => e === emoji.replace(/:/g, ''));
 if (!selectedEmoji) {
  ch.errorCmd(cmd, language.t.errors.emoteNotFound, language);
  return;
 }

 const message = await ch.getMessage(messageLink);
 if (!message) {
  ch.errorCmd(cmd, language.t.errors.messageNotFound, language);
  return;
 }

 const sticker = stickerName
  ? message.stickers.find((s) => s.name === stickerName || s.id === stickerName)
  : message.stickers.first();
 if (!sticker) {
  ch.errorCmd(cmd, language.t.errors.stickerNotFound, language);
  return;
 }

 const lan = language.slashCommands.stickers;

 const created = await ch.request.guilds.createSticker(
  cmd.guild,
  {
   file: (await Discord.DataResolver.resolveFile(sticker.url)) as Discord.RawFile,
   name,
   description,
   tags: selectedEmoji,
  },
  lan.createReason(cmd.user),
 );

 if ('message' in created) {
  ch.errorCmd(cmd, created.message, language);
  return;
 }

 ch.replyCmd(cmd, {
  content: language.slashCommands.stickers.created(created),
 });
};

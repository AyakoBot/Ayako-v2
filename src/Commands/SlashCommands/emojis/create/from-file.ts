import * as Discord from 'discord.js';
import Emojis from '../../../../BaseClient/Other/Emojis.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction,
 _args: string[],
 type: 'sticker' | 'emoji' = 'emoji',
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const name = cmd.options
  .getString('name', true)
  .replace(type === 'emoji' ? /[^a-zA-Z0-9_]/g : '', '');
 const img = cmd.options.getAttachment('file', true);

 if (type === 'sticker') {
  const emoji = cmd.options.getString('emoji', true);
  const selectedEmoji = Emojis.find((e) => e === emoji.replace(/:/g, ''));
  if (!selectedEmoji) {
   cmd.client.util.errorCmd(cmd, language.errors.emoteNotFound, language);
   return;
  }
 }

 const lan = type === 'emoji' ? language.slashCommands.emojis : language.slashCommands.stickers;

 const created = await (type === 'emoji'
  ? cmd.client.util.request.guilds.createEmoji(
     cmd.guild,
     {
      name,
      image: img.url,
     },
     lan.createReason(cmd.user),
    )
  : cmd.client.util.request.guilds.createSticker(
     cmd.guild,
     {
      name,
      file: (await Discord.DataResolver.resolveFile(img.url)) as Discord.RawFile,
      description: cmd.options.getString('description', true),
      tags: Discord.parseEmoji(cmd.options.getString('emoji', true))!.name,
     },
     lan.createReason(cmd.user),
    ));

 if ('message' in created) {
  cmd.client.util.errorCmd(cmd, created.message, language);
  return;
 }

 if (type === 'emoji') {
  cmd.client.util.replyCmd(cmd, {
   content: language.slashCommands.emojis.created(created as Discord.GuildEmoji),
  });
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  content: language.slashCommands.stickers.created(created as Discord.Sticker),
 });
};

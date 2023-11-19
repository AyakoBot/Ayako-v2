import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import Emojis from '../../../../BaseClient/Other/Emojis.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction,
 _args: string[],
 type: 'sticker' | 'emoji' = 'emoji',
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const name = cmd.options
  .getString('name', true)
  .replace(type === 'emoji' ? /[^a-zA-Z0-9_]/g : '', '');
 const img = cmd.options.getAttachment('file', true);

 if (type === 'sticker') {
  const emoji = cmd.options.getString('emoji', true);
  const selectedEmoji = Emojis.find((e) => e === emoji.replace(/:/g, ''));
  if (!selectedEmoji) {
   ch.errorCmd(cmd, language.t.errors.emoteNotFound, language);
   return;
  }
 }

 const lan = type === 'emoji' ? language.slashCommands.emojis : language.slashCommands.stickers;

 const created = await (type === 'emoji'
  ? ch.request.guilds.createEmoji(
     cmd.guild,
     {
      name,
      image: img.url,
     },
     lan.createReason(cmd.user),
    )
  : ch.request.guilds.createSticker(
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
  ch.errorCmd(cmd, created.message, language);
  return;
 }

 if (type === 'emoji') {
  ch.replyCmd(cmd, {
   content: language.slashCommands.emojis.created(created as Discord.GuildEmoji),
  });
  return;
 }

 ch.replyCmd(cmd, {
  content: language.slashCommands.stickers.created(created as Discord.Sticker),
 });
};

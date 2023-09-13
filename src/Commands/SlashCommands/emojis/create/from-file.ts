import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true).replace(/[^a-zA-Z0-9_]/g, '');
 const img = cmd.options.getAttachment('file', true);

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.emojis;

 const image = await Discord.DataResolver.resolveImage(img.url);
 if (!image) {
  ch.errorCmd(cmd, language.errors.invalidEmote, await ch.languageSelector(cmd.guildId));
  return;
 }

 const createdEmote = await ch.request.guilds.createEmoji(
  cmd.guild,
  {
   name,
   image,
  },
  lan.createReason(cmd.user),
 );

 if ('message' in createdEmote) {
  ch.errorCmd(cmd, createdEmote.message, language);
  return;
 }

 ch.replyCmd(cmd, { content: lan.created(createdEmote) });
};

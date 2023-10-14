import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true).replace(/[^a-zA-Z0-9_]/g, '');
 const img = cmd.options.getAttachment('file', true);

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.emojis;

 const createdEmote = await ch.request.guilds.createEmoji(
  cmd.guild,
  {
   name,
   image: img.url,
  },
  lan.createReason(cmd.user),
 );

 if ('message' in createdEmote) {
  ch.errorCmd(cmd, createdEmote, language);
  return;
 }

 ch.replyCmd(cmd, { content: lan.created(createdEmote) });
};

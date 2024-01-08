import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true).replace(/[^a-zA-Z0-9_]/g, '');
 const img = cmd.options.getString('url', true);

 try {
  new URL(img);
 } catch (e) {
  cmd.client.util.errorCmd(cmd, e as Error, await cmd.client.util.getLanguage(cmd.guildId));
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.emojis;

 const createdEmote = await cmd.client.util.request.guilds.createEmoji(
  cmd.guild,
  {
   name,
   image: img,
  },
  lan.createReason(cmd.user),
 );

 if ('message' in createdEmote) {
  cmd.client.util.errorCmd(cmd, createdEmote.message, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.created(createdEmote) });
};

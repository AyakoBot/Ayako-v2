import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true).replace(/[^a-zA-Z0-9_]/g, '');
 const rawEmoji = cmd.options.getString('emoji', true);
 const emoji = Discord.parseEmoji(rawEmoji);
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.emojis;

 if (!rawEmoji.match(cmd.client.util.regexes.emojiTester)?.length || !emoji) {
  cmd.client.util.errorCmd(
   cmd,
   language.errors.invalidEmote,
   await cmd.client.util.getLanguage(cmd.guildId),
  );
  return;
 }

 const createdEmote = await cmd.client.util.request.guilds.createEmoji(
  cmd.guild,
  {
   name,
   image: cmd.client.util.constants.standard.emoteURL(emoji as Discord.Emoji),
  },
  lan.createReason(cmd.user),
 );

 if ('message' in createdEmote) {
  cmd.client.util.errorCmd(cmd, createdEmote.message, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.created(createdEmote) });
};

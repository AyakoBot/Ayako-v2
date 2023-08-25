import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import { GuildEmoji } from '../../../../BaseClient/Other/classes.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true).replace(/[^a-zA-Z0-9_]/g, '');
 const rawEmoji = cmd.options.getString('emoji', true);
 const emoji = Discord.parseEmoji(rawEmoji);
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.emojis;

 if (ch.regexes.emojiTester.test(rawEmoji) || !emoji) {
  ch.errorCmd(cmd, language.errors.invalidEmote, await ch.languageSelector(cmd.guildId));
  return;
 }

 const image = await Discord.DataResolver.resolveImage(
  ch.constants.standard.emoteURL(emoji as Discord.Emoji),
 );
 if (!image) {
  ch.errorCmd(cmd, language.errors.invalidEmote, await ch.languageSelector(cmd.guildId));
  return;
 }

 const res = await ch.request.guilds.createEmoji(
  cmd.guild,
  {
   name,
   image,
  },
  lan.createReason(cmd.user),
 );

 if ('message' in res) {
  ch.errorCmd(cmd, res.message, language);
  return;
 }

 const createdEmote = new GuildEmoji(cmd.client, res, cmd.guild);

 ch.replyCmd(cmd, { content: lan.created(createdEmote) });
};

import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true).replace(/[^a-zA-Z0-9_]/g, '');
 const image = cmd.options.getString('url', true);

 try {
  new URL(image);
 } catch (e) {
  ch.errorCmd(cmd, (e as Error).message, await ch.languageSelector(cmd.guildId));
  return;
 }

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.emojis;

 const res = await cmd.guild.emojis
  .create({
   name,
   attachment: image,
   reason: lan.createReason(cmd.user),
  })
  .catch((err) => err as Discord.DiscordAPIError);

 if (res instanceof Discord.GuildEmoji) {
  ch.replyCmd(cmd, { content: lan.created(res) });
  return;
 }

 ch.errorCmd(cmd, res.message, language);
};

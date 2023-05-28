import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.Message,
 text?: string,
) => {
 if (cmd instanceof Discord.ChatInputCommandInteraction && !cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;
 if (!cmd.channel) return;
 const author = cmd instanceof Discord.ChatInputCommandInteraction ? cmd.user : cmd.author;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.afk;

 const afk = await ch.query(
  `SELECT * FROM afk WHERE userid = $1 AND guildid = $2;`,
  [author.id, cmd.guildId],
  { returnType: 'afk', asArray: false },
 );

 const embed: Discord.APIEmbed = {
  color: ch.constants.colors.loading,
  description: afk ? lan.updated : lan.set(author.id),
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction && !afk) {
  await ch.replyCmd(cmd, { embeds: [embed], ephemeral: false });
 } else if (cmd instanceof Discord.ChatInputCommandInteraction) {
  await ch.replyCmd(cmd, { embeds: [embed], ephemeral: true });
 } else {
  await ch.send(cmd.channel, { embeds: [embed] });
  if (cmd.deletable) cmd.delete();
 }

 if (
  cmd.member?.manageable &&
  cmd.guild.members.me?.permissions.has(134217728n) &&
  Number(cmd.member?.displayName.length) <= 26
 ) {
  await cmd.member?.setNickname(`${cmd.member?.displayName} [AFK]`, lan.setReason);
 }

 if (cmd instanceof Discord.ChatInputCommandInteraction) {
  text = cmd.options.getString('reason', false) ?? undefined;
 }

 await ch.query(
  `INSERT INTO afk (userid, guildid, text, since) VALUES ($1, $2, $3, $4) 
   ON CONFLICT (userid, guildid) DO 
   UPDATE SET text = $3, since = $4;`,
  [author.id, cmd.guildId, text, Date.now()],
 );
};

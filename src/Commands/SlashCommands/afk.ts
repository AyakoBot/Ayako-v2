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

 if (cmd instanceof Discord.ChatInputCommandInteraction) {
  text = cmd.options.getString('reason', false) ?? undefined;
 }

 const embeds: Discord.APIEmbed[] = text
  ? [
     {
      color: ch.constants.colors.loading,
      description: text,
     },
    ]
  : [];

 if (cmd instanceof Discord.ChatInputCommandInteraction && !afk) {
  await ch.replyCmd(cmd, {
   embeds,
   ephemeral: false,
   content: afk ? lan.updated : lan.set(author),
  });
 } else if (cmd instanceof Discord.ChatInputCommandInteraction) {
  await ch.replyCmd(cmd, {
   embeds,
   ephemeral: true,
   content: afk ? lan.updated : lan.set(author),
  });
 } else {
  await ch.send(cmd.channel, { embeds, content: afk ? lan.updated : lan.set(author) });
  if (cmd.deletable) cmd.delete();
 }

 if (
  cmd.member?.manageable &&
  cmd.guild.members.me?.permissions.has(134217728n) &&
  Number(cmd.member?.displayName.length) <= 26
 ) {
  await cmd.member?.setNickname(`${cmd.member?.displayName} [AFK]`, lan.setReason);
 }

 await ch.query(
  `INSERT INTO afk (userid, guildid, text, since) VALUES ($1, $2, $3, $4) 
   ON CONFLICT (userid, guildid) DO 
   UPDATE SET text = $3, since = $4;`,
  [author.id, cmd.guildId, text, Date.now()],
 );
};

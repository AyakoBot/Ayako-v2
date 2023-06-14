import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.MessageContextMenuCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 await ch.query(
  `INSERT INTO stickymessages (guildid, lastmsgid, channelid) VALUES ($1, $2, $3) ON CONFLICT (channelid) DO NOTHING;`,
  [cmd.guildId, cmd.targetId, cmd.channelId],
 );

 const res = await ch.query(
  `SELECT * FROM stickymessages WHERE guildid = $1 AND channelid = $2;`,
  [cmd.guildId, cmd.channelId],
  { returnType: 'stickymessages', asArray: false },
 );

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.contextCommands.message['Stick Message'];

 ch.replyCmd(cmd, {
  content: res?.lastmsgid === cmd.targetId ? lan.reply : lan.already,
 });
};

import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.MessageContextMenuCommandInteraction) => {
 if (!cmd.inGuild()) return;
 if (!cmd.inCachedGuild()) return;

 const res = await ch.query(
  `INSERT INTO stickymessages (guildid, lastmsgid, channelid) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`,
  [cmd.guildId, cmd.targetId, cmd.channelId],
 );

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.contextCommands.message['stick-message'];

 ch.replyCmd(cmd, {
  content: res ? lan.reply : lan.already,
 });
};

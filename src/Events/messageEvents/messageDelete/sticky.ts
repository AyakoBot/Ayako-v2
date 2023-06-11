import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (msg: Discord.Message<true>) => {
 ch.query(`DELETE FROM stickymessages WHERE lastmsgid = $1 AND channelid = $2;`, [
  msg.id,
  msg.channel.id,
 ]);
};

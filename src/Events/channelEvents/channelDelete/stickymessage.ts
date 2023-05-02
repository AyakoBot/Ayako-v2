import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default (channel: Discord.Channel) =>
 ch.query(`DELETE FROM stickymessage WHERE channelid = $1;`, [channel.id]);

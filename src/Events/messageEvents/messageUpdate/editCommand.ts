import * as Discord from 'discord.js';
import type DBT from '../../../Typings/DataBaseTypings';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import { getCommand } from '../messageCreate/commandHandler';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
  if (!oldMsg || !msg || !oldMsg.content || !msg.content) return;
  if (oldMsg.content === msg.content) return;
  if (oldMsg.crosspostable !== msg.crosspostable) return;

  let prefix;
  const prefixStandard = ch.constants.standard.prefix;
  let prefixCustom;

  if (msg.channel.type !== Discord.ChannelType.GuildAnnouncement) {
    prefixCustom = await ch
      .query('SELECT * FROM guildsettings WHERE guildid = $1;', [String(msg.guildId)])
      .then((r: DBT.guildsettings[] | null) => (r ? r[0].prefix : null));
  }

  if (msg.content.toLowerCase().startsWith(prefixStandard)) prefix = prefixStandard;
  else if (prefixCustom && msg.content.toLowerCase().startsWith(prefixCustom)) {
    prefix = prefixCustom;
  } else return;
  if (!prefix) return;

  const args = msg.content.slice(prefix.length).split(/ +/);
  const { file: command } = await getCommand(args);
  if (!command) return;

  client.emit('messageCreate', msg as unknown as Discord.Message);
};

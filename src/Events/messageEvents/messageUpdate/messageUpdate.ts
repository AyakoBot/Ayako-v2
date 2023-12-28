import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import commandHandler from '../messageCreate/commandHandler.js';
import log from './log.js';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 await ch.firstGuildInteraction(msg.guild);

 log(oldMsg, msg);
 commandHandler(msg);
};

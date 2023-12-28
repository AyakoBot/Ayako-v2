import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (role: Discord.Role) => {
 await ch.firstGuildInteraction(role.guild);

 log(role);
};

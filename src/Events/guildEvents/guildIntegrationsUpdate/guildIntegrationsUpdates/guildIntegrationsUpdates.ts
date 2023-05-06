import type * as Discord from 'discord.js';
import log from './log.js';

export default async (oldIntegration: Discord.Integration, integration: Discord.Integration) => {
 log(oldIntegration, integration);
};

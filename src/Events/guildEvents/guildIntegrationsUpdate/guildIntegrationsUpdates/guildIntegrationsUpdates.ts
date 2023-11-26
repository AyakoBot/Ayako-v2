import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
 oldIntegration: Discord.Integration | undefined,
 integration: Discord.Integration,
) => {
 if (!oldIntegration) return;
 log(oldIntegration, integration);
};

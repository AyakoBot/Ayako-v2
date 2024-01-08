import * as Discord from 'discord.js';

export const requiresSlashCommand = true;
export default (msg: Discord.Message<true>) => msg.client.util.interactionHelpers(msg);

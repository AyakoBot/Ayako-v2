import type { ButtonInteraction } from 'discord.js';
import { disboardSent } from '../../../Events/BotEvents/messageEvents/messageCreate/disboard.js';

export default async (cmd: ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;
 await cmd.deferUpdate();

 disboardSent(cmd);
};

import type * as Discord from 'discord.js';
import log from './log.js';

export default async (stage: Discord.StageInstance) => {
 if (!stage.guild) return;

 log(stage);
};

import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
 oldStage: Discord.StageInstance | undefined,
 stage: Discord.StageInstance,
) => {
 if (!oldStage) return;
 if (!stage.guild) return;

 log(oldStage, stage);
};

import type * as Discord from 'discord.js';

export default async (
 oldStage: Discord.StageInstance | undefined,
 stage: Discord.StageInstance,
) => {
 if (!oldStage) return;
 if (!stage.guild) return;

 stage.client.util.importCache.Events.BotEvents.stageInstanceEvents.stageInstanceUpdate.log.file.default(
  oldStage,
  stage,
 );
};

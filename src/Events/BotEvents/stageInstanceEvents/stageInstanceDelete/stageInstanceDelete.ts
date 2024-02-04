import type * as Discord from 'discord.js';

export default async (stage: Discord.StageInstance) => {
 if (!stage.guild) return;

 stage.client.util.importCache.Events.BotEvents.stageInstanceEvents.stageInstanceDelete.log.file.default(
  stage,
 );
};

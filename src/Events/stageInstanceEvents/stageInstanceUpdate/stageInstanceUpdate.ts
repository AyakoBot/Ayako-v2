import type * as Discord from 'discord.js';

export default async (
  oldStage: Discord.StageInstance | undefined,
  stage: Discord.StageInstance,
) => {
  if (!oldStage) return;

  const files: {
    default: (p: Discord.StageInstance, o: Discord.StageInstance) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldStage, stage));
};

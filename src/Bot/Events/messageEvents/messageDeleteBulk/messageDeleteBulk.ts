import type DDeno from 'discordeno';

export default async (msgs: DDeno.Message[]) => {
  if (!msgs) return;

  const files: { default: (t: DDeno.Message[]) => void }[] = await Promise.all(
    ['./log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(msgs));
};

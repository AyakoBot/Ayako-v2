import type * as Discord from 'discord.js';

export default async (cmd: Discord.Interaction) => {
  const files: {
    default: (m: Discord.Interaction) => void;
  }[] = await Promise.all(
    [
      './commandHandler.js',
      './buttonHandler.js',
      './modalHandler.js',
      './contextCommandHandler.js',
      './selectHandler.js',
    ].map((p) => import(p)),
  );

  files.forEach((f) => f.default(cmd));
};

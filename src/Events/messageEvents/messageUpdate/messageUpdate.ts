import type * as Discord from 'discord.js';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
  const files: {
    default: (t: Discord.Message, t2: Discord.Message) => void;
  }[] = await Promise.all(
    (msg.guild ? ['./log.js', './editCommand.js'] : ['./editCommand.js']).map((p) => import(p)),
  );

  files.forEach((f) => f.default(oldMsg, msg));
};

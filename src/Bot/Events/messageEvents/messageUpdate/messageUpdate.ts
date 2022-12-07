import type * as DDeno from 'discordeno';

export default async (msg: DDeno.Message, oldMsg?: DDeno.Message, fromCache?: boolean) => {
  if (!oldMsg) return;
  if (!fromCache) return;

  const files: {
    default: (t: DDeno.Message, t2: DDeno.Message) => void;
  }[] = await Promise.all(
    (msg.guildId ? ['./log.js', './editCommand.js'] : ['./editCommand.js']).map((p) => import(p)),
  );

  files.forEach((f) => f.default(msg, oldMsg));
};

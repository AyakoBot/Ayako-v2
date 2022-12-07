export default async (payload: { channelId: bigint; messageId: bigint; guildId?: bigint }) => {
  if (!payload.guildId) return;

  const files: {
    default: (t: { channelId: bigint; messageId: bigint; guildId?: bigint }) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload));
};

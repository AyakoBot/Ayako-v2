import type { StringSelectMenuInteraction } from 'discord.js';
import redis from '../../../BaseClient/Bot/Redis.js';
import { prefix } from '../../../BaseClient/UtilModules/getScheduled.js';
import { dataPrefix } from '../../../BaseClient/UtilModules/setScheduled.js';

export default async (cmd: StringSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingsId = args.shift();
 const settings = await cmd.client.util.DataBase.votePunish.findUnique({
  where: { uniquetimestamp: settingsId, active: true },
 });

 if (!settings) {
  cmd.client.util.request.channels.deleteMessage(cmd.message);
  redis.expire(`${prefix}:votePunish:expire:${cmd.guild.id}:${cmd.channel!.id}`, 1);

  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.events.redis.votePunish;

 if (!cmd.member?.roles.cache.find((r) => settings.reqRoles.includes(r.id))) {
  cmd.client.util.notYours(cmd, language);
  return;
 }

 const current = await redis.get(
  `${dataPrefix}:votePunish:execute:${cmd.guildId}:${settings.roleId}`,
 );
 if (!current) return;

 const data = JSON.parse(current) as {
  id: number;
  guildId: string;
  channelId: string;
  msgId: string;
  options: string[];
  voters: { id: string; votes: string[] }[];
 };

 if (data.voters.find((v) => v.id === cmd.user.id)) {
  data.voters.find((v) => v.id === cmd.user.id)!.votes = cmd.values;
 } else data.voters.push({ id: cmd.user.id, votes: cmd.values });

 redis.set(
  `${dataPrefix}:votePunish:execute:${cmd.guildId}:${settings.roleId}`,
  JSON.stringify(data),
 );

 cmd.client.util.replyCmd(cmd, { ephemeral: true, content: lan.thanks });
};

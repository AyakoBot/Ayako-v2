import { ButtonStyle, ComponentType, Role, type UserSelectMenuInteraction } from 'discord.js';
import redis from '../../../BaseClient/Bot/Redis.js';
import { prefix } from '../../../BaseClient/UtilModules/getScheduled.js';

export default async (cmd: UserSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingId = args.shift();
 const userId = args.shift();
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.events.redis.votePunish;

 if (cmd.user.id !== userId) {
  cmd.client.util.notYours(cmd, language);
  return;
 }

 const settings = await cmd.client.util.DataBase.votePunish.findUnique({
  where: { uniquetimestamp: Number(settingId) },
 });
 if (!settings) {
  redis.expire(`${prefix}:votePunish:expire:${cmd.guild.id}:${cmd.channel!.id}`, 1);
  return;
 }

 redis.expire(`${prefix}:votePunish:expire:${cmd.guild.id}:${cmd.channel!.id}`, 60);

 cmd.update({
  content: `${cmd.users.map((u) => u.toString()).join(', ')}\n\n${lan.voteContent(
   cmd.client.util.constants.standard.getTime(Date.now() + 30000),
   settings.reqRoles.map((r) => cmd.guild.roles.cache.get(r)).filter((r): r is Role => !!r),
  )}`,
  components: [
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.StringSelect,
      custom_id: `votePunish_${settingId}`,
      placeholder: lan.pick,
      min_values: 1,
      max_values: cmd.users.size + 1,
      options: [...cmd.users.map((u) => u), cmd.user].map((u) => ({
       label: u.username,
       description: u.globalName || undefined,
       value: u.id,
      })),
     },
    ],
   },
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.Button,
      style: ButtonStyle.Danger,
      custom_id: `votePunish/cancel_${settings.roleId}_${userId}`,
      label: language.t.Cancel,
     },
    ],
   },
  ],
 });

 cmd.client.util.setScheduled(
  `votePunish:execute:${cmd.guildId}:${settings.roleId}`,
  JSON.stringify({
   id: Number(settingId),
   guildId: cmd.guildId,
   channelId: cmd.channelId,
   msgId: cmd.message.id,
   options: [...cmd.users.map((u) => u), cmd.user].map((u) => u.id),
   voters: [],
  }),
  30,
 );
};

import type { pingReport } from '@prisma/client';
import { ButtonStyle, ComponentType, GuildMember, type APIEmbed, type Message } from 'discord.js';
import type { Language } from 'src/Typings/Typings.js';
import Redis from '../../../../BaseClient/Bot/Redis.js';

export default async (msg: Message) => {
 if (!msg.inGuild()) return;
 if (msg.author.bot) return;
 if (!msg.mentions.roles.size) return;

 const settings = await msg.client.util.DataBase.pingReport.findMany({
  where: {
   guildid: msg.guildId,
   roleId: { in: msg.mentions.roles.map((r) => r.id) },
   channelIds: { isEmpty: false },
   active: true,
  },
 });
 if (!settings) return;

 const language = await msg.client.util.getLanguage(msg.guildId);
 const me = await msg.client.util.getBotMemberFromGuild(msg.guild);
 const cooldownKeys = await Redis.keys(`${process.env.mainId}:ratelimits:*`);

 settings.forEach(async (s) => {
  const pingedMembers = await runReporter(s, msg, language, cooldownKeys, me);
  if (msg.guild.memberCount - 100 < msg.guild.members.cache.size) return;

  const members = await msg.client.util.fetchAllGuildMembers(msg.guild);
  const notPinged = members.filter(
   (m) => !pingedMembers.includes(m.id) && m.roles.cache.has(s.roleId!),
  );
  if (!notPinged.length) return;

  await runReporter(s, msg, language, cooldownKeys, me, notPinged);
 });
};

const runReporter = async (
 settings: pingReport,
 msg: Message<true>,
 language: Language,
 cooldownKeys: string[],
 me: GuildMember,
 fixedMembers?: GuildMember[],
) => {
 const role = msg.guild.roles.cache.get(settings.roleId!);
 if (!role) return [];

 if (cooldownKeys.includes(`${process.env.mainId}:ratelimits:${settings.roleId}`)) return [];

 const lan = language.events.messageCreate.pingReporter;

 const members = fixedMembers ?? role.members.map((m) => m.id);
 if (members.length > 100) return [];

 Redis.setex(`${process.env.mainId}:ratelimits:${role.id}`, Number(settings.cooldown), 'true');

 const content = members.map((m) => `<@${m}>`).join(' ');

 const embed: APIEmbed = {
  author: { name: lan.author },
  description: lan.desc(role, msg.channel, msg.author),
  color: msg.client.util.getColor(me),
 };

 msg.client.util.send(
  { id: settings.channelIds, guildId: msg.guildId },
  {
   content,
   embeds: [embed],
   components: [
    {
     type: ComponentType.ActionRow,
     components: [
      {
       type: ComponentType.Button,
       style: ButtonStyle.Link,
       label: language.t.JumpToMessage,
       url: msg.url,
      },
     ],
    },
   ],
  },
 );

 return members;
};

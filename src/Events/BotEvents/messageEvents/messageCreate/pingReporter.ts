import { ButtonStyle, ComponentType, type APIEmbed, type Message } from 'discord.js';
import Redis from '../../../../BaseClient/Bot/Redis.js';

export default async (msg: Message) => {
 if (!msg.inGuild()) return;
 if (msg.author.bot) return;
 if (!msg.mentions.roles.size) return;

 const settings = await msg.client.util.DataBase.pingReport.findUnique({
  where: {
   guildid: msg.guildId,
   roleIds: { hasSome: msg.mentions.roles.map((r) => r.id) },
   channelIds: { isEmpty: false },
  },
 });
 if (!settings) return;

 const mentionedRoles = msg.mentions.roles.filter((r) => settings.roleIds.includes(r.id));
 if (!mentionedRoles.size) return;

 const cooldownKeys = await Redis.keys(`${process.env.mainId}:ratelimits:*`);
 const rolesWithoutCooldown = mentionedRoles.filter(
  (r) => !cooldownKeys.find((c) => c.includes(r.id)),
 );
 if (!rolesWithoutCooldown.size) return;

 const language = await msg.client.util.getLanguage(msg.guildId);
 const lan = language.events.messageCreate.pingReporter;
 const me = await msg.client.util.getBotMemberFromGuild(msg.guild);

 rolesWithoutCooldown.forEach((role) => {
  const members = role.members.map((m) => m.id);
  if (members.length > 100) return;

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
 });
};

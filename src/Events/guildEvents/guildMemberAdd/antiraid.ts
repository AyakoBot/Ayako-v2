import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { runPunishment } from '../../../Commands/ButtonCommands/antiraid/punish.js';
import * as CT from '../../../Typings/Typings.js';

export default async (member: Discord.GuildMember) => {
 const settings = await ch.DataBase.antiraid.findUnique({
  where: { guildid: member.guild.id, active: true },
 });
 if (!settings) return;

 addMember(member, settings);
 check(member.guild, settings);
};

const addMember = (member: Discord.GuildMember, settings: Prisma.antiraid) => {
 let cache = ch.cache.antiraid.get(member.guild.id);

 if (!cache) {
  ch.cache.antiraid.set(member.guild.id, new Set());
  cache = ch.cache.antiraid.get(member.guild.id);
 }

 if (!cache) {
  ch.error(member.guild, new Error('Cache cannot be set'));
  return;
 }

 cache.add(member);

 Jobs.scheduleJob(new Date(Date.now() + Number(settings.timeout) * 1000), () => {
  cache?.delete(member);
  if (!cache?.size) ch.cache.antiraid.delete(member.guild.id);
 });
};

const check = async (guild: Discord.Guild, settings: Prisma.antiraid) => {
 const cache = ch.cache.antiraid.get(guild.id);
 if (!cache) return;
 if (cache.size < Number(settings.jointhreshold)) return;
 if (ch.cache.antiraidQueued.has(guild.id)) return;
 ch.cache.antiraidQueued.add(guild.id);

 const caughtUsers: Discord.GuildMember[] = Array.from(cache.values());
 const times2Loop = Math.min(150000 / (Number(settings.timeout) * 1000));
 const timeoutBetweenLoops = 150000 / times2Loop;
 const endTime = Date.now() + 300000;
 let invitesDisabled: boolean = false;

 if (settings.disableinvites && !guild.features.includes(Discord.GuildFeature.InvitesDisabled)) {
  const res = await ch.request.guilds.edit(guild, {
   features: [...(guild.features as Discord.GuildFeature[]), Discord.GuildFeature.InvitesDisabled],
  });

  if (!('message' in res)) {
   invitesDisabled = true;

   ch.DataBase.guildsettings
    .update({
     where: { guildid: guild.id },
     data: { enableinvitesat: endTime },
    })
    .then();

   ch.cache.enableInvites.set(
    guild.id,
    Jobs.scheduleJob(new Date(endTime), () => {
     enableInvites(guild);
    }),
   );
  }
 }

 new Array(times2Loop).fill(null).forEach((_, i) => {
  Jobs.scheduleJob(new Date(Date.now() + timeoutBetweenLoops * i), () => {
   caughtUsers.push(...(ch.cache.antiraid.get(guild.id)?.values() ?? []));
   ch.cache.antiraid.delete(guild.id);
  });
 });
 await ch.sleep(150000);

 const last5mins = guild.members.cache
  .filter((m) => Number(m.joinedTimestamp) > Date.now() - 300000)
  .map((m) => m);

 let additionalEmbeds: Discord.APIEmbed[] = [];

 if (settings.actiontof && settings.action) {
  const language = await ch.getLanguage(guild.id);
  additionalEmbeds = await runPunishment(
   language,
   caughtUsers.map((c) => c.id),
   settings.action,
   guild,
  );
 }

 if (settings.posttof && settings.postchannels.length) {
  postMessage(last5mins, caughtUsers, settings, guild, additionalEmbeds, invitesDisabled, endTime);
 }
};

const postMessage = async (
 last5mins: Discord.GuildMember[],
 caughtUsers: Discord.GuildMember[],
 settings: Prisma.antiraid,
 guild: Discord.Guild,
 additionalEmbeds: Discord.APIEmbed[],
 invitesDisabled: boolean,
 endTime: number,
) => {
 const language = await ch.getLanguage(guild.id);
 const lan = language.events.guildMemberAdd.antiraid;

 const last5minsLang = last5mins
  .map((m) => language.languageFunction.getUser(m.user))
  .join('')
  .replace(/`/g, '');
 const last5minsIDs = ch
  .getChunks(
   last5mins.map((m) => m.id),
   3,
  )
  .map((a) => a.join(' '))
  .join('\n');
 const caughtUsersLang = caughtUsers
  .map((m) => language.languageFunction.getUser(m.user))
  .join('')
  .replace(/`/g, '');
 const caughtUsersIDs = ch
  .getChunks(
   caughtUsers.map((m) => m.id),
   3,
  )
  .map((a) => a.join(' '))
  .join('\n');

 const invites = invitesDisabled
  ? language.events.guildMemberAdd.antiraid.invitesDisabled(ch.constants.standard.getTime(endTime))
  : language.events.guildMemberAdd.antiraid.invitesNotDisabled;

 const desc = `${
  additionalEmbeds
   .map((e) => e.description)
   .filter((d): d is string => !!d)
   .join('\n') ?? invites
 }${`\n${invites}` ?? ''}`;

 ch.send(
  { id: settings.postchannels, guildId: guild.id },
  {
   content: `${settings.pingusers.map((u) => `<@${u}>`).join(', ')}\n${settings.pingroles
    .map((r) => `<@&${r}>`)
    .join(', ')})}`,
   allowed_mentions: {
    users: settings.pingusers,
    roles: settings.pingroles,
   },
   files: await Promise.all(
    [last5minsLang, last5minsIDs, caughtUsersLang, caughtUsersIDs].map((a, i) =>
     ch.txtFileWriter(
      a,
      undefined,
      ['last_5_mins_users', 'last_5_mins_ids', 'caught_users', 'caught_users_ids'][i],
     ),
    ),
   ),
   embeds: [
    {
     author: {
      name: language.autotypes.antiraid,
     },
     title: lan.title,
     description: lan.desc(last5mins.length, caughtUsers.length),
     color: CT.Colors.Danger,
     fields: [
      {
       name: lan.actionsTaken,
       value: desc,
       inline: false,
      },
     ],
    },
   ],
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.Button,
       label: lan.buttons.printLast5mins,
       style: Discord.ButtonStyle.Secondary,
       emoji: { name: '🖨️' },
       custom_id: 'antiraid/print_last5mins',
      },
      {
       type: Discord.ComponentType.Button,
       label: lan.buttons.printCaughtUsers,
       style: Discord.ButtonStyle.Secondary,
       emoji: { name: '🖨️' },
       custom_id: 'antiraid/print_caughtUsers',
      },
     ],
    },
    ...(settings.action !== 'ban' || !settings.actiontof
     ? ([
        {
         type: Discord.ComponentType.ActionRow,
         components: [
          ...(settings.action !== 'kick' || !settings.actiontof
           ? [
              {
               type: Discord.ComponentType.Button,
               label: lan.buttons.kickCaughtUsers,
               style: Discord.ButtonStyle.Secondary,
               emoji: ch.emotes.crossWithBackground,
               custom_id: 'antiraid/punish_kick',
              },
             ]
           : []),
          {
           type: Discord.ComponentType.Button,
           label: lan.buttons.banCaughtUsers,
           style: Discord.ButtonStyle.Secondary,
           emoji: ch.emotes.ban,
           custom_id: 'antiraid/punish_ban',
          },
         ],
        },
       ] as Discord.APIActionRowComponent<Discord.APIButtonComponentWithCustomId>[])
     : []),
   ],
  },
 );
};

export const enableInvites = (guild: Discord.Guild) => {
 ch.request.guilds.edit(guild, {
  features: guild.features.filter(
   (f) => f !== Discord.GuildFeature.InvitesDisabled,
  ) as Discord.GuildFeature[],
 });

 ch.cache.enableInvites.delete(guild.id);

 if (!guild.features.includes(Discord.GuildFeature.InvitesDisabled)) return;

 ch.DataBase.guildsettings.update({
  where: { guildid: guild.id },
  data: { enableinvitesat: null },
 });
};

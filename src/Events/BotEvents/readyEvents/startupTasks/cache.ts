import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../../../BaseClient/Bot/Client.js';
import { endDeleteSuggestion } from '../../../../Commands/ModalCommands/suggestion/accept.js';
import {
 end as endGiveaway,
 giveawayCollectTimeExpired,
} from '../../../../Commands/SlashCommands/giveaway/end.js';
import { end as endReminder } from '../../../../Commands/SlashCommands/reminder/create.js';
import * as CT from '../../../../Typings/Typings.js';
import { enableInvites } from '../../guildEvents/guildMemberAdd/antiraid.js';
import { bumpReminder } from '../../messageEvents/messageCreate/disboard.js';
import { del } from '../../voiceStateEvents/voiceStateDeletes/voiceHub.js';

export default () => {
 reminder();

 client.guilds.cache.forEach(async (guild) => {
  Object.values(tasks).forEach((t) => t(guild));
 });
};

const reminder = async () => {
 const reminders = await client.util.DataBase.reminders.findMany({
  where: {},
 });

 reminders.forEach((r) => {
  client.util.cache.reminders.set(
   Jobs.scheduleJob(
    new Date(Number(r.endtime) < Date.now() ? Date.now() + 10000 : Number(r.endtime)),
    () => {
     endReminder(r);
    },
   ),
   r.userid,
   Number(r.endtime),
  );
 });
};

export const tasks = {
 vcDeleteTimeouts: async (guild: Discord.Guild) => {
  const settings = await client.util.DataBase.voicehubs.findMany({
   where: { guildid: guild.id },
  });

  const vcs = await client.util.DataBase.voicechannels.findMany({ where: { guildid: guild.id } });

  vcs.forEach(async (vc) => {
   const delDB = () =>
    client.util.DataBase.voicechannels
     .delete({ where: { guildid_channelid: { guildid: vc.guildid, channelid: vc.channelid } } })
     .then();

   const applyingSetting = settings.find((s) => vc.hubid === s.channelid);
   if (!applyingSetting) {
    delDB();
    return;
   }

   const channel = await client.util.getChannel.guildVoiceChannel(vc.channelid);
   if (!channel) {
    delDB();
    return;
   }

   if (channel.members.size) return;

   if (!vc.everyonelefttime) {
    client.util.DataBase.voicechannels
     .update({
      where: { guildid_channelid: { guildid: guild.id, channelid: channel.id } },
      data: { everyonelefttime: Date.now() },
     })
     .then();
   }

   client.util.cache.vcDeleteTimeout.set(
    Jobs.scheduleJob(new Date(Date.now() + Number(applyingSetting.deletetime) * 1000), () =>
     del(channel),
    ),
    guild.id,
    channel.id,
   );
  });
 },
 deleteSuggestions: async (guild: Discord.Guild) => {
  const settings = await client.util.DataBase.suggestionsettings.findUnique({
   where: {
    guildid: guild.id,
    active: true,
    OR: [{ deleteapproved: true }, { deletedenied: true }],
   },
  });
  if (!settings) return;

  const suggestions = await client.util.DataBase.suggestionvotes.findMany({
   where: { guildid: guild.id },
  });

  suggestions.forEach((s) => {
   client.util.cache.deleteSuggestions.set(
    Jobs.scheduleJob(
     new Date(
      Date.now() +
       (s.approved ? Number(settings.deleteapprovedafter) : Number(settings.deletedeniedafter)) *
        1000,
     ),
     async () => {
      endDeleteSuggestion(s);
     },
    ),
    guild.id,
    s.msgid,
   );
  });
 },
 disboard: async (guild: Discord.Guild) => {
  const settings = await client.util.DataBase.disboard.findUnique({
   where: { guildid: guild.id, nextbump: { not: null } },
  });
  if (!settings) return;

  client.util.cache.disboardBumpReminders.set(
   Jobs.scheduleJob(
    new Date(
     Number(settings.nextbump) < Date.now() ? Date.now() + 10000 : Number(settings.nextbump),
    ),
    () => {
     bumpReminder(guild);
    },
   ),
   settings.guildid,
  );
 },
 giveaways: async (guild: Discord.Guild) => {
  const giveaways = await client.util.DataBase.giveaways.findMany({
   where: {
    guildid: guild.id,
    ended: false,
    claimingdone: false,
   },
  });

  giveaways.forEach((g) => {
   client.util.cache.giveaways.set(
    Jobs.scheduleJob(
     new Date(Number(g.endtime) < Date.now() ? Date.now() + 10000 : Number(g.endtime)),
     () => {
      endGiveaway(g);
     },
    ),
    g.guildid,
    g.channelid,
    g.msgid,
   );
  });
 },
 punishments: async (guild: Discord.Guild) => {
  const language = await client.util.getLanguage(guild.id);
  const where = { where: { guildid: guild.id } };
  const tables = [
   {
    rows: () => client.util.DataBase.punish_mutes.findMany(where),
    cache: client.util.cache.mutes,
    event: CT.ModTypes.MuteRemove,
   },
   {
    rows: () => client.util.DataBase.punish_tempbans.findMany(where),
    cache: client.util.cache.bans,
    event: CT.ModTypes.BanRemove,
   },
   {
    rows: () => client.util.DataBase.punish_tempchannelbans.findMany(where),
    cache: client.util.cache.channelBans,
    event: CT.ModTypes.ChannelBanRemove,
   },
  ] as const;

  tables.forEach(async (table) => {
   (await table.rows()).forEach((m) => {
    const time = Number(m.uniquetimestamp) + Number(m.duration) * 1000;

    table.cache.set(
     Jobs.scheduleJob(new Date(Date.now() < time ? 1000 : time), async () => {
      const target = m.userid
       ? await client.util.getUser(m.userid).catch(() => undefined)
       : undefined;
      if (!target) {
       client.util.error(
        guild,
        new Error(`Could not find user to initialize ${table}Remove event.`),
       );
       return;
      }

      const channel = await client.util.getChannel.guildTextChannel(m.channelid);

      client.util.mod(
       m.msgid && channel
        ? await client.util.request.channels
           .getMessage(channel, m.msgid)
           .then((s) => ('message' in s ? undefined : s))
        : undefined,
       table.event,
       {
        executor: m.executorid
         ? await client.util.getUser(m.executorid).catch(() => undefined)
         : undefined,
        target,
        reason: m.reason ?? language.t.None,
        guild,
        skipChecks: true,
        dbOnly:
         'banchannelid' in m
          ? !!guild.channels.cache.get((m as Prisma.punish_tempchannelbans).banchannelid)
          : false,
        channel:
         'banchannelid' in m
          ? (guild.channels.cache.get(
             (m as Prisma.punish_tempchannelbans).banchannelid,
            ) as Discord.GuildChannel)
          : undefined,
       } as CT.ModOptions<
        CT.ModTypes.ChannelBanRemove | CT.ModTypes.BanRemove | CT.ModTypes.MuteRemove
       >,
      );
     }),
     guild.id,
     'banchannelid' in m ? m.channelid : m.userid,
     m.userid,
    );
   });
  });
 },
 claimTimeouts: async (guild: Discord.Guild) => {
  const claimTimeouts = await client.util.DataBase.giveawaycollection.findMany({
   where: { guildid: guild.id },
  });
  claimTimeouts?.forEach((t) => {
   client.util.cache.giveawayClaimTimeout.set(
    Jobs.scheduleJob(
     new Date(Number(t.endtime) < Date.now() ? Date.now() + 10000 : Number(t.endtime)),
     () => {
      giveawayCollectTimeExpired(t.msgid, t.guildid);
     },
    ),
    t.guildid,
    t.msgid,
   );
  });
 },
 enableInvites: async (guild: Discord.Guild) => {
  const settings = await client.util.DataBase.guildsettings.findUnique({
   where: { guildid: guild.id, enableinvitesat: { not: null } },
  });
  if (!settings) return;

  client.util.cache.enableInvites.set(
   guild.id,
   Jobs.scheduleJob(new Date(Number(settings.enableinvitesat)), () => {
    enableInvites(guild);
   }),
  );
 },
};

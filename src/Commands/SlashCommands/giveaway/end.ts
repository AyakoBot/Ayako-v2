import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../../BaseClient/Bot/Client.js';
import * as CT from '../../../Typings/Typings.js';
import getPathFromError from '../../../BaseClient/UtilModules/getPathFromError.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const messageId = cmd.options.getString('message-id', true);
 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.end;
 const giveaway = await client.util.DataBase.giveaways.findUnique({
  where: { msgid: messageId, ended: false },
 });

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  client.util.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 await end(giveaway);

 client.util.replyCmd(cmd, { content: lan.manuallyEnded });
};

export const end = async (giveaway: Prisma.giveaways) => {
 const guild = client.guilds.cache.get(giveaway.guildid);
 if (!guild) return;

 giveawayCollectTime(guild, giveaway.msgid);
};

export const getGiveawayEmbed = async (language: CT.Language, giveaway: Prisma.giveaways) => {
 const guild = client.guilds.cache.get(giveaway.guildid);
 const host = await client.util.request.users.get(
  guild,
  giveaway.host,
  client as Discord.Client<true>,
 );

 return {
  author: {
   name: language.slashCommands.giveaway.create.author,
   icon_url: client.util.emotes.ayakoLove.link,
  },
  description: giveaway.description,
  title: giveaway.participants?.length
   ? language.slashCommands.giveaway.participate.participants(giveaway.participants.length)
   : undefined,
  fields: [
   {
    name: language.slashCommands.giveaway.create.winners(Number(giveaway.winnercount)),
    value: language.slashCommands.giveaway.create.end(
     client.util.constants.standard.getTime(Number(giveaway.endtime)),
    ),
   },
   giveaway.reqrole
    ? {
       name: language.slashCommands.giveaway.create.roleRequire,
       value: `<@&${giveaway.reqrole}>`,
      }
    : undefined,
  ].filter((f): f is Discord.APIEmbedField => !!f),
  footer:
   host && !('message' in host)
    ? {
       text: language.slashCommands.giveaway.create.host(host),
       icon_url: host.displayAvatarURL(),
      }
    : undefined,
  color: client.util.getColor(guild ? await client.util.getBotMemberFromGuild(guild) : undefined),
 };
};

export const giveawayCollectTime = async (guild: Discord.Guild, msgId: string) => {
 const giveaway = await client.util.DataBase.giveaways.findUnique({
  where: { msgid: msgId, claimingdone: false },
 });

 if (!giveaway) {
  client.util.error(guild, new Error('Giveaway not found'));
  return;
 }

 const language = await client.util.getLanguage(giveaway.guildid);
 const embed = await getGiveawayEmbed(language, giveaway);

 if (guild.memberCount - guild.memberCount / 10 > guild.members.cache.size) {
  await guild.client.util.fetchAllGuildMembers(guild);
 }

 embed.author.name += ` | ${language.slashCommands.giveaway.end.ended}`;

 if (!giveaway.participants?.length) {
  embed.fields.push({
   name:
    Number(giveaway.winnercount) > 1
     ? language.slashCommands.giveaway.end.winners
     : language.slashCommands.giveaway.end.winner,
   value: language.slashCommands.giveaway.end.noValidEntries,
  });
 } else {
  const winners = new Array(giveaway.winners.length || Number(giveaway.winnercount))
   .fill(0)
   .map(() => {
    const random = client.util.getRandom(0, Number(giveaway.participants?.length || 1) - 1);
    const winner = giveaway.participants.filter((p) =>
     giveaway.reqrole ? guild.members.cache.get(p)?.roles.cache.has(giveaway.reqrole) : true,
    )[random];
    giveaway.participants.splice(giveaway.participants.indexOf(winner), 1);

    return winner;
   })
   .filter((w): w is string => !!w);

  giveaway.winners = winners;

  client.util.DataBase.giveaways
   .update({
    where: { msgid: giveaway.msgid },
    data: {
     winners,
     ended: true,
    },
   })
   .then();

  embed.fields.push({
   name:
    Number(giveaway.winnercount) > 1
     ? language.slashCommands.giveaway.end.winners
     : language.slashCommands.giveaway.end.winner,
   value: giveaway.winners?.map((w) => `<@${w}>`).join(', '),
  });
 }

 giveaway.ended = true;

 const msg = await getMessage(giveaway);
 if (!msg) return;

 await client.util.request.channels.editMsg(msg, {
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     getButton(language, giveaway),
     giveaway.actualprize && giveaway.collecttime ? getClaimButton(language, giveaway) : undefined,
    ].filter((r): r is Discord.APIButtonComponentWithCustomId => !!r),
   },
  ],
 });

 if (!giveaway.winners?.length) return;

 const host = await client.util.getUser(giveaway.host);
 if (!host) client.util.error(msg.guild, new Error('Host not found'));

 const collectionEnd = Date.now() + Number(giveaway.collecttime);

 const replyMsg = await client.util.send(msg.channel, {
  content: giveaway.winners.map((w) => `<@${w}>`).join(', '),
  embeds: [
   {
    author: {
     name: language.slashCommands.giveaway.create.author,
     icon_url: client.util.emotes.ayakoLove.link,
    },
    title: language.slashCommands.giveaway.end.title,
    color: CT.Colors.Success,
    url: client.util.constants.standard.msgurl(
     giveaway.guildid,
     giveaway.channelid,
     giveaway.msgid,
    ),
    fields:
     !giveaway.collecttime || !giveaway.actualprize
      ? [
         {
          name: language.slashCommands.giveaway.end.dmUser,
          value: host ? language.languageFunction.getUser(host) : language.t.Unknown,
         },
        ]
      : [
         {
          name: language.slashCommands.giveaway.end.clickButton,
          value: language.slashCommands.giveaway.end.until(
           client.util.constants.standard.getTime(collectionEnd),
          ),
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
      style: Discord.ButtonStyle.Link,
      label: language.slashCommands.giveaway.end.button,
      url: client.util.constants.standard.msgurl(
       giveaway.guildid,
       giveaway.channelid,
       giveaway.msgid,
      ),
     },
     {
      type: Discord.ComponentType.Button,
      label: language.slashCommands.giveaway.end.reroll,
      style: Discord.ButtonStyle.Danger,
      emoji: client.util.emotes.refresh,
      custom_id: `giveaway/reroll_${giveaway.msgid}`,
     },
    ],
   },
  ],
 });

 if (!replyMsg) {
  client.util.error(msg.guild, new Error('Winners could not be notified'));
  return;
 }

 if (!giveaway.collecttime) return;
 if (!giveaway.actualprize) return;

 const collection = await client.util.DataBase.giveawaycollection.findUnique({
  where: { msgid: giveaway.msgid },
 });

 if (collection) {
  const oldReplyMsg = await getMessage({
   channelid: giveaway.channelid,
   guildid: giveaway.guildid,
   msgid: collection.replymsgid,
  });

  if (oldReplyMsg && (await client.util.isDeleteable(oldReplyMsg))) {
   client.util.request.channels.deleteMessage(oldReplyMsg);
  }
 }

 client.util.DataBase.giveawaycollection
  .upsert({
   where: { msgid: giveaway.msgid },
   create: {
    msgid: giveaway.msgid,
    endtime: collectionEnd,
    guildid: giveaway.guildid,
    replymsgid: replyMsg.id,
    requiredwinners: giveaway.winners,
   },
   update: {
    endtime: collectionEnd,
    replymsgid: replyMsg.id,
    requiredwinners: giveaway.winners,
   },
  })
  .then();

 client.util.cache.giveawayClaimTimeout.delete(giveaway.guildid, giveaway.msgid);

 client.util.cache.giveawayClaimTimeout.set(
  Jobs.scheduleJob(getPathFromError(new Error(giveaway.msgid)), new Date(collectionEnd), () => {
   giveawayCollectTimeExpired(giveaway.msgid, giveaway.guildid);
  }),
  giveaway.guildid,
  giveaway.msgid,
 );
};

export const giveawayCollectTimeExpired = async (msgId: string, guildId: string) => {
 const guild = client.guilds.cache.get(guildId);
 if (!guild) return;

 const giveaway = await client.util.DataBase.giveaways.findUnique({
  where: { msgid: msgId, claimingdone: false },
 });

 if (!giveaway) return;
 if (!giveaway.winners.length) return;

 if (!giveaway.failreroll) {
  failReroll(giveaway);
  return;
 }

 giveawayCollectTime(guild, giveaway.msgid);
};

export const getMessage = async (giveaway: {
 channelid: string;
 guildid: string;
 msgid: string;
}) => {
 const guild = client.guilds.cache.get(giveaway.guildid);
 if (!guild) return undefined;

 const channel = await client.util.getChannel.guildTextChannel(giveaway.channelid);
 if (!channel) {
  client.util.error(guild, new Error('Channel not found'));

  client.util.DataBase.giveaways
   .delete({
    where: { channelid: giveaway.channelid, guildid: giveaway.guildid, msgid: giveaway.msgid },
   })
   .then();

  client.util.DataBase.giveawaycollection
   .delete({
    where: { msgid: giveaway.msgid, guildid: giveaway.guildid },
   })
   .then();
  return undefined;
 }

 const msg = await client.util.request.channels.getMessage(channel, giveaway.msgid);
 if ('message' in msg) {
  client.util.DataBase.giveaways
   .delete({ where: { msgid: giveaway.msgid, guildid: giveaway.guildid } })
   .then();

  client.util.DataBase.giveawaycollection
   .delete({ where: { msgid: giveaway.msgid, guildid: giveaway.guildid } })
   .then();

  return undefined;
 }

 return msg;
};

export const getButton = (
 language: CT.Language,
 giveaway: Prisma.giveaways,
): Discord.APIButtonComponentWithCustomId => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Primary,
 custom_id: 'giveaway/participate',
 label: language.slashCommands.giveaway.create.participate,
 emoji: client.util.emotes.gift,
 disabled: giveaway.ended,
});

export const getClaimButton = (
 language: CT.Language,
 giveaway: Prisma.giveaways,
): Discord.APIButtonComponentWithCustomId => ({
 type: Discord.ComponentType.Button,
 style: giveaway.claimingdone ? Discord.ButtonStyle.Secondary : Discord.ButtonStyle.Primary,
 custom_id: 'giveaway/claim',
 label: giveaway.claimingdone
  ? language.slashCommands.giveaway.end.claimingdone
  : language.slashCommands.giveaway.end.claim,
});

export const failReroll = async (giveaway: Prisma.giveaways) => {
 const collection = await client.util.DataBase.giveawaycollection.findUnique({
  where: { msgid: giveaway.msgid },
 });

 if (collection) {
  const oldReplyMsg = await getMessage({
   channelid: giveaway.channelid,
   guildid: giveaway.guildid,
   msgid: collection.replymsgid,
  });

  if (oldReplyMsg && (await client.util.isDeleteable(oldReplyMsg))) {
   client.util.request.channels.deleteMessage(oldReplyMsg);
  }
 }

 client.util.DataBase.giveawaycollection
  .delete({
   where: { msgid: giveaway.msgid },
  })
  .then();

 client.util.DataBase.giveaways
  .update({
   where: { msgid: giveaway.msgid },
   data: { claimingdone: true },
  })
  .then();

 const msg = await getMessage(giveaway);
 if (!msg) return;

 const language = await client.util.getLanguage(giveaway.guildid);
 const claimButton = getClaimButton(language, giveaway);
 claimButton.label = language.slashCommands.giveaway.end.expired;
 claimButton.disabled = true;

 await client.util.request.channels.editMsg(msg, {
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [getButton(language, giveaway), claimButton].filter(
     (r): r is Discord.APIButtonComponentWithCustomId => !!r,
    ),
   },
  ],
 });
};

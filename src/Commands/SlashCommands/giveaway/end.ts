import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import * as DBT from '../../../Typings/DataBaseTypings.js';
import client from '../../../BaseClient/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const messageID = cmd.options.getString('message-id', true);

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.giveaway.end;

 const giveaway = await ch.query(
  `SELECT * FROM giveaways WHERE msgid = $1 AND ended = false;`,
  [messageID],
  {
   returnType: 'giveaways',
   asArray: false,
  },
 );

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  ch.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 await end(giveaway);

 ch.replyCmd(cmd, { content: lan.manuallyEnded });
};

export const end = async (g: DBT.giveaways) => {
 client.shard?.broadcastEval(
  async (cl, { giveaway }) => {
   const guild = cl.guilds.cache.get(giveaway.guildid);
   if (!guild) return;

   const { giveawayCollectTime: gCT } = (await import(
    `${process.cwd()}/Commands/SlashCommands/giveaway/end.js`
   )) as {
    giveawayCollectTime: typeof giveawayCollectTime;
   };

   gCT(guild, giveaway.msgid);
  },
  { context: { giveaway: g } },
 );
};

export const getGiveawayEmbed = async (language: CT.Language, giveaway: DBT.giveaways) => {
 const host = await client.users.fetch(giveaway.host).catch(() => undefined);

 return {
  author: {
   name: language.slashCommands.giveaway.create.author,
   icon_url: ch.objectEmotes.ayakoLove.link,
  },
  description: giveaway.description,
  title: giveaway.participants?.length
   ? language.slashCommands.giveaway.participate.participants(giveaway.participants.length)
   : undefined,
  fields: [
   {
    name: language.slashCommands.giveaway.create.winners(Number(giveaway.winnercount)),
    value: language.slashCommands.giveaway.create.end(
     ch.constants.standard.getTime(Number(giveaway.endtime)),
    ),
   },
   giveaway.reqrole
    ? {
       name: language.slashCommands.giveaway.create.roleRequire,
       value: `<@&${giveaway.reqrole}>`,
      }
    : undefined,
  ].filter((f): f is Discord.APIEmbedField => !!f),
  footer: host
   ? {
      text: language.slashCommands.giveaway.create.host(host),
      icon_url: host.displayAvatarURL(),
     }
   : undefined,
  color: ch.colorSelector(client.guilds.cache.get(giveaway.guildid)?.members.me),
 };
};

export const giveawayCollectTime = async (guild: Discord.Guild, msgID: string) => {
 const giveaway = await ch.query(`SELECT * FROM giveaways WHERE msgid = $1;`, [msgID], {
  returnType: 'giveaways',
  asArray: false,
 });

 if (!giveaway) {
  ch.error(guild, new Error('Giveaway not found'));
  return;
 }

 const language = await ch.languageSelector(giveaway.guildid);
 const embed = await getGiveawayEmbed(language, giveaway);

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
    const random = ch.getRandom(0, Number(giveaway.participants?.length) - 1);
    const winner = giveaway.participants[random];
    giveaway.participants.splice(giveaway.participants.indexOf(winner), 1);

    return winner;
   });

  giveaway.winners = winners;
  ch.query(`UPDATE giveaways SET winners = $1, ended = true WHERE msgid = $2;`, [
   winners,
   giveaway.msgid,
  ]);

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

 await msg.edit({
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     getButton(language, giveaway),
     giveaway.actualprize && giveaway.collecttime ? getClaimButton(language, giveaway) : undefined,
    ].filter((r): r is Discord.APIButtonComponent => !!r),
   },
  ],
 });

 if (!giveaway.winners?.length) return;

 const host = await ch.getUser(giveaway.host);
 if (!host) ch.error(msg.guild, new Error('Host not found'));

 const collectionEnd = Date.now() + Number(giveaway.collecttime);

 const replyMsg = await ch.send(msg.channel, {
  content: giveaway.winners.map((w) => `<@${w}>`).join(', '),
  embeds: [
   {
    author: {
     name: language.slashCommands.giveaway.create.author,
     icon_url: ch.objectEmotes.ayakoLove.link,
    },
    title: language.slashCommands.giveaway.end.title,
    color: ch.constants.colors.success,
    url: ch.constants.standard.msgurl(giveaway.guildid, giveaway.channelid, giveaway.msgid),
    fields:
     !giveaway.collecttime || !giveaway.actualprize
      ? [
         {
          name: language.slashCommands.giveaway.end.dmUser,
          value: host ? language.languageFunction.getUser(host) : language.Unknown,
         },
        ]
      : [
         {
          name: language.slashCommands.giveaway.end.clickButton,
          value: language.slashCommands.giveaway.end.until(
           ch.constants.standard.getTime(collectionEnd),
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
      url: ch.constants.standard.msgurl(giveaway.guildid, giveaway.channelid, giveaway.msgid),
     },
    ],
   },
  ],
 });

 if (!replyMsg) {
  ch.error(msg.guild, new Error('Winners could not be notified'));
  return;
 }

 if (!giveaway.collecttime) return;
 if (!giveaway.actualprize) return;

 const collection = await ch.query(
  `SELECT * FROM giveawaycollection WHERE msgid = $1;`,
  [giveaway.msgid],
  {
   returnType: 'giveawaycollection',
   asArray: false,
  },
 );

 if (collection) {
  const oldReplyMsg = await getMessage({
   channelid: giveaway.channelid,
   guildid: giveaway.guildid,
   msgid: collection.replymsgid,
  });

  if (oldReplyMsg && oldReplyMsg.deletable) oldReplyMsg.delete().catch(() => undefined);
 }

 ch.query(
  `INSERT INTO giveawaycollection (msgid, endtime, guildid, replymsgid) VALUES ($1, $2, $3, $4) ON CONFLICT (msgid) DO UPDATE SET endtime = $2, replymsgid = $4;`,
  [giveaway.msgid, collectionEnd, giveaway.guildid, replyMsg.id],
 );

 ch.cache.giveawayClaimTimeout.delete(giveaway.guildid, giveaway.msgid);

 ch.cache.giveawayClaimTimeout.set(
  Jobs.scheduleJob(new Date(collectionEnd), () => {
   giveawayCollectTimeExpired(giveaway.msgid, giveaway.guildid);
  }),
  giveaway.guildid,
  giveaway.msgid,
 );
};

export const giveawayCollectTimeExpired = (msgID: string, guildID: string) => {
 client.shard?.broadcastEval(
  async (cl, { gID, mID }) => {
   const guild = cl.guilds.cache.get(gID);
   if (!guild) return;

   const chEval: typeof ch = await import(`${process.cwd()}/BaseClient/ClientHelper.js`);
   const giveaway = await chEval.query(`SELECT * FROM giveaways WHERE msgid = $1;`, [mID], {
    returnType: 'giveaways',
    asArray: false,
   });

   if (!giveaway) {
    ch.error(guild, new Error('Giveaway not found'));
    return;
   }

   if (!giveaway.winners.length) return;

   const { giveawayCollectTime: gCT, failReroll: fR } = (await import(
    `${process.cwd()}/Commands/SlashCommands/giveaway/end.js`
   )) as {
    giveawayCollectTime: typeof giveawayCollectTime;
    failReroll: typeof failReroll;
   };

   if (!giveaway.failreroll) {
    fR(giveaway);
    return;
   }

   gCT(guild, giveaway.msgid);
  },
  { context: { gID: guildID, mID: msgID } },
 );
};

export const getMessage = async (giveaway: {
 channelid: string;
 guildid: string;
 msgid: string;
}) => {
 const guild = client.guilds.cache.get(giveaway.guildid);
 if (!guild) return undefined;

 const channel = await ch.getChannel.guildTextChannel(giveaway.channelid);
 if (!channel) {
  ch.error(guild, new Error('Channel not found'));
  return undefined;
 }

 const msg = await channel.messages
  .fetch(giveaway.msgid)
  .catch((err) => err as Discord.DiscordAPIError);
 if ('message' in msg) {
  ch.error(guild, msg);
  return undefined;
 }

 return msg;
};

export const getButton = (
 language: CT.Language,
 giveaway: DBT.giveaways,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Primary,
 custom_id: 'giveaway/participate',
 label: language.slashCommands.giveaway.create.participate,
 emoji: ch.objectEmotes.gift,
 disabled: giveaway.ended,
});

export const getClaimButton = (
 language: CT.Language,
 giveaway: DBT.giveaways,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Primary,
 custom_id: 'giveaway/claim',
 label: giveaway.claimingdone
  ? language.slashCommands.giveaway.end.claimingdone
  : language.slashCommands.giveaway.end.claim,
 disabled: giveaway.claimingdone,
});

export const failReroll = async (giveaway: DBT.giveaways) => {
 const collection = await ch.query(
  `SELECT * FROM giveawaycollection WHERE msgid = $1;`,
  [giveaway.msgid],
  {
   returnType: 'giveawaycollection',
   asArray: false,
  },
 );

 if (collection) {
  const oldReplyMsg = await getMessage({
   channelid: giveaway.channelid,
   guildid: giveaway.guildid,
   msgid: collection.replymsgid,
  });

  if (oldReplyMsg && oldReplyMsg.deletable) oldReplyMsg.delete().catch(() => undefined);
 }

 const msg = await getMessage(giveaway);
 if (!msg) return;

 const language = await ch.languageSelector(giveaway.guildid);
 const claimButton = getClaimButton(language, giveaway);
 claimButton.label = language.slashCommands.giveaway.end.expired;
 claimButton.disabled = true;

 await msg.edit({
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [getButton(language, giveaway), claimButton].filter(
     (r): r is Discord.APIButtonComponent => !!r,
    ),
   },
  ],
 });

 ch.query(`DELETE FROM giveawaycollection WHERE msgid = $1;`, [giveaway.msgid]);
 ch.query(`UPDATE giveaways SET claimingdone = true WHERE msgid = $1;`, [giveaway.msgid]);
};

import jobs from 'node-schedule';
import StringSimilarity from 'string-similarity';
import type DDeno from 'discordeno';
import ChannelRules, { ActivityFlags } from '../../../BaseClient/Other/ChannelRules';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import client from '../../../BaseClient/DDenoClient.js';

const guildCooldown = new Set();
const lastMessageGuild = new Map();

const globalCooldown = new Set();
const lastMessageGlobal = new Map();

const antiLevelSpam = new Map();

export default async (msg: CT.MessageGuild) => {
  if (msg.author.toggles.bot) return;
  if (msg.channel.type === 1) return;

  globalLeveling(msg);
  guildLeveling(msg);
};

const globalLeveling = async (msg: CT.MessageGuild) => {
  if (globalCooldown.has(msg.author.id)) return;

  const lastMessage = lastMessageGlobal.get(msg.author.id);
  if (lastMessage && StringSimilarity.compareTwoStrings(msg.content, lastMessage) > 0.9) return;
  lastMessageGlobal.set(msg.author.id, msg.content);

  globalCooldown.add(msg.author.id);

  const date = new Date(Date.now() + 60000);
  jobs.scheduleJob(date, () => {
    globalCooldown.delete(msg.author.id);
  });

  const levelRow = await client.ch
    .query(`SELECT * FROM level WHERE type = $1 AND userid = $2;`, ['global', String(msg.authorId)])
    .then((r: DBT.level[] | null) => (r ? r[0] : null));

  if (levelRow) {
    updateLevels(msg, null, levelRow, 10, 'global', 1);
  } else {
    insertLevels(msg, 'global', 10, 1);
  }
};

const guildLeveling = async (msg: CT.MessageGuild) => {
  const alsEntry = antiLevelSpam.get(msg.author.id);
  if (alsEntry && alsEntry === msg.content) return;
  antiLevelSpam.set(msg.author.id, msg.content);

  const levelingRow = await checkEnabled(msg);
  if (!levelingRow) return;
  if (!msg.member) return;

  if (levelingRow) {
    if (levelingRow.ignoreprefixes && levelingRow.prefixes?.length) {
      const startsWith = levelingRow.prefixes?.some((w) =>
        msg.content.toLowerCase().startsWith(w.toLowerCase()),
      );
      if (startsWith) return;
    }

    if (!levelingRow.wlusers || !levelingRow.wlusers.includes(String(msg.author.id))) {
      if (levelingRow.blusers && levelingRow.blusers?.includes(String(msg.author.id))) return;
      if (
        levelingRow.blroles &&
        msg.member.roles.some((r) => levelingRow.blroles?.includes(String(r)))
      ) {
        return;
      }

      if (
        !levelingRow.wlroles ||
        !msg.member.roles.some((r) => levelingRow.wlroles?.includes(String(r)))
      ) {
        if (levelingRow.blchannels && levelingRow.blchannels.includes(String(msg.channelId))) {
          return;
        }

        if (
          levelingRow.wlchannels &&
          levelingRow.wlchannels.length &&
          !levelingRow.wlchannels.includes(String(msg.channelId))
        ) {
          return;
        }
      }
    }
  }

  const rulesRows = await getRulesRes(msg);
  if (rulesRows && rulesRows.length) {
    const passesRules = checkPass(msg, rulesRows);
    if (!passesRules) return;
  }

  if (guildCooldown.has(msg.author.id)) return;

  const lastMessage = lastMessageGuild.get(msg.author.id);
  if (lastMessage && StringSimilarity.compareTwoStrings(msg.content, lastMessage) > 0.9) return;
  lastMessageGuild.set(msg.author.id, msg.content);

  guildCooldown.add(msg.author.id);

  const date = new Date(Date.now() + 60000);
  jobs.scheduleJob(date, () => {
    guildCooldown.delete(msg.author.id);
  });

  const res = await client.ch
    .query(`SELECT * FROM level WHERE type = $1 AND userid = $2 AND guildid = $3;`, [
      'guild',
      String(msg.authorId),
      String(msg.guildId),
    ])
    .then((r: DBT.level[] | null) => (r ? r[0] : null));

  if (res) {
    updateLevels(
      msg,
      levelingRow,
      res,
      levelingRow ? Number(levelingRow.xppermsg) - 10 : 15,
      'guild',
      levelingRow ? Number(levelingRow.xpmultiplier) : 1,
    );
  } else {
    insertLevels(
      msg,
      'guild',
      levelingRow ? Number(levelingRow.xppermsg) - 10 : 15,
      levelingRow ? Number(levelingRow.xpmultiplier) : 1,
    );
  }
};

const insertLevels = (
  msg: CT.MessageGuild,
  type: 'guild' | 'global',
  baseXP: number,
  xpMultiplier: number,
) =>
  client.ch.query(
    `INSERT INTO level (type, userid, xp, level, guildid) VALUES ($1, $2, $3, $4, $5);`,
    [
      type,
      String(msg.authorId),
      Math.floor(Math.random() * baseXP + 10) * xpMultiplier,
      0,
      type === 'guild' ? String(msg.guildId) : 1,
    ],
  );

const updateLevels = async (
  msg: CT.MessageGuild,
  row: DBT.leveling | null,
  lvlupObj: DBT.level,
  baseXP: number,
  type: 'guild' | 'global',
  xpMultiplier: number,
) => {
  if (row) {
    const roleMultiplier = await getRoleMultiplier(msg);
    const channelMultiplier = await getChannelMultiplier(msg);

    if (roleMultiplier) xpMultiplier = roleMultiplier;
    if (channelMultiplier) xpMultiplier = channelMultiplier;
  }

  const newXp = Math.floor(Math.random() * baseXP + 10) * xpMultiplier;
  const oldLevel = Number(lvlupObj.level);
  const oldXp = Number(lvlupObj.xp);
  const xp = oldXp + newXp;
  let newLevel = oldLevel;
  const neededXP =
    (5 / 6) * (newLevel + 1) * (2 * (newLevel + 1) * (newLevel + 1) + 27 * (newLevel + 1) + 91);

  if (xp >= neededXP) {
    newLevel += 1;
    if (row) {
      levelUp(msg, row, {
        oldXp,
        newXp: xp,
        newLevel,
        oldLevel,
      });
    }
  }

  if (type === 'guild') {
    client.ch.query(
      `UPDATE level SET level = $1, xp = $2 WHERE type = $3 AND userid = $4 AND guildid = $5;`,
      [newLevel, xp, type, String(msg.authorId), String(msg.guildId)],
    );
  } else {
    client.ch.query(`UPDATE level SET level = $1, xp = $2 WHERE type = $3 AND userid = $4;`, [
      newLevel,
      xp,
      type,
      String(msg.authorId),
    ]);
  }
};

const checkEnabled = async (msg: CT.MessageGuild) =>
  client.ch
    .query(`SELECT * FROM leveling WHERE guildid = $1 AND active = true;`, [String(msg.guildId)])
    .then((r: DBT.leveling[] | null) => (r ? r[0] : null));

const levelUp = async (
  msg: CT.MessageGuild,
  settingsrow: DBT.leveling,
  levelData: {
    oldXp: number;
    newXp: number;
    newLevel: number;
    oldLevel: number;
  },
) => {
  switch (Number(settingsrow?.lvlupmode)) {
    case 1: {
      await doEmbed(msg, settingsrow, levelData);
      break;
    }
    case 2: {
      await doReact(msg, settingsrow, levelData);
      break;
    }
    default: {
      break;
    }
  }

  roleAssign(msg, settingsrow.rolemode, levelData.newLevel);
};

const roleAssign = async (msg: CT.MessageGuild, rolemode: boolean, newLevel: number) => {
  if (!msg.member) return;

  const levelingrolesRow = await client.ch
    .query(`SELECT * FROM levelingroles WHERE guildid = $1;`, [String(msg.guildId)])
    .then((r: DBT.levelingroles[] | null) => r || null);

  if (!levelingrolesRow) return;

  let add: bigint[] = [];
  let rem: bigint[] = [];

  switch (Number(rolemode)) {
    case 0: {
      // stack
      const thisLevelsRows = levelingrolesRow.filter((r) => Number(r.level) <= Number(newLevel));
      thisLevelsRows.forEach((r) => {
        const roleMap = r.roles
          ?.map((roleid) => {
            if (!msg.member?.roles.includes(BigInt(roleid))) return roleid;
            return null;
          })
          .filter((req) => !!req);

        if (roleMap?.length) {
          add = [...new Set([...add, ...roleMap])].filter((s): s is bigint => s !== null);
        }
      });
      break;
    }
    case 1: {
      // replace
      const thisLevelsAndBelowRows = levelingrolesRow.filter(
        (r) => Number(r.level) <= Number(newLevel),
      );

      thisLevelsAndBelowRows.forEach((r) => {
        const remr: bigint[] = [];
        const addr: bigint[] = [];
        r.roles?.forEach((roleid) => {
          if (Number(r.level) < Number(newLevel) && msg.member?.roles.includes(BigInt(roleid))) {
            if (msg.guild?.roles.get(BigInt(roleid))) remr.push(BigInt(roleid));
          }

          if (Number(r.level) === Number(newLevel) && !msg.member?.roles.includes(BigInt(roleid))) {
            if (msg.guild?.roles.get(BigInt(roleid))) addr.push(BigInt(roleid));
          }
        });

        if (addr.length) add = [...new Set([...add, ...addr])];
        if (remr.length) rem = [...new Set([...rem, ...remr])];
      });
      break;
    }
    default: {
      break;
    }
  }

  if (add.length) await client.ch.roleManager.add(msg.member, add, msg.language.leveling.reason);
  if (rem.length) await client.ch.roleManager.remove(msg.member, rem, msg.language.leveling.reason);
};

const doReact = async (
  msg: CT.MessageGuild,
  row: DBT.leveling,
  levelData: {
    oldXp: number;
    newXp: number;
    newLevel: number;
    oldLevel: number;
  },
) => {
  const reactions: string[] = [];
  let emotes: DDeno.Emoji[] | null = [];

  if (row.lvlupemotes?.length) {
    emotes = (
      await Promise.all(row.lvlupemotes.map((emoteID) => client.ch.getEmote(emoteID)))
    ).filter((emote): emote is DDeno.Emoji => !!emote);

    emotes.forEach((emote) => {
      reactions.push(`${emote.name}:${emote.id}`);
    });
  } else {
    client.objectEmotes.levelupemotes.forEach((emote) => reactions.push(emote.id || emote.name));
  }

  if (levelData.newLevel === 1) {
    infoEmbed(msg, emotes);
  }

  await Promise.all(
    reactions.map((emote) =>
      client.helpers.addReaction(msg.channelId, msg.id, emote).catch(() => null),
    ),
  );

  const date = new Date(Date.now() + 10000);
  jobs.scheduleJob(date, () => {
    reactions.map((emote) =>
      client.helpers.deleteReactionsEmoji(msg.channelId, msg.id, emote).catch(() => null),
    );
  });
};

const doEmbed = async (
  msg: CT.MessageGuild,
  settinsgrow: DBT.leveling,
  levelData: {
    oldXp: number;
    newXp: number;
    newLevel: number;
    oldLevel: number;
  },
) => {
  const getDefaultEmbed = async (): Promise<DDeno.Embed> => ({
    author: {
      name: msg.language.leveling.author,
    },
    color: await client.ch.colorSelector(msg.member),
  });

  let embed;

  const options = [
    ['msg', msg],
    ['user', msg.author],
    ['newLevel', levelData.newLevel],
    ['oldLevel', levelData.oldLevel],
    ['newXP', levelData.newXp],
    ['oldXP', levelData.oldXp],
  ];

  if (!settinsgrow.embed) {
    embed = client.ch.dynamicToEmbed(await getDefaultEmbed(), options as [string, unknown][]);
  } else {
    const customembedRow = await client.ch
      .query(`SELECT * FROM customembeds WHERE uniquetimestamp = $1 AND guildid = $2;`, [
        settinsgrow.embed,
        String(msg.guildId),
      ])
      .then((r: DBT.customembeds[] | null) => (r ? r[0] : null));

    if (customembedRow) {
      const partialEmbed = client.ch.getDiscordEmbed(customembedRow);
      embed = client.ch.dynamicToEmbed(partialEmbed, options as [string, unknown][]);
    } else {
      embed = client.ch.dynamicToEmbed(await getDefaultEmbed(), options as [string, unknown][]);
    }
  }

  if (embed) send(msg, { embeds: [embed] }, settinsgrow);
};

const send = async (msg: CT.MessageGuild, payload: DDeno.CreateMessage, row: DBT.leveling) => {
  const channelIDs =
    row.lvlupchannels && row.lvlupchannels.length ? row.lvlupchannels : [msg.channel.id];

  const channels = channelIDs.map((ch) => msg.guild?.channels.get(BigInt(ch)));
  const msgs = await Promise.all(
    channels
      .filter((c): c is DDeno.Channel => !!c)
      .map((c) => client.ch.send(c, payload, msg.language).catch(() => null)),
  );

  if (row.lvlupdeltimeout) {
    const date = new Date(Date.now() + row.lvlupdeltimeout);
    jobs.scheduleJob(date, () => {
      Promise.all(
        msgs
          .map((m) => {
            if (Array.isArray(m)) return null;
            if (m) {
              return client.helpers
                .deleteMessage(m.channelId, m.id, msg.language.deleteReasons.leveling)
                .catch(() => null);
            }
            return null;
          })
          .filter((p): p is Promise<void> => !!p),
      );
    });
  }
};

const getRulesRes = async (msg: CT.MessageGuild) => {
  const levelingruleschannelsRows = await client.ch
    .query(`SELECT * FROM levelingruleschannels WHERE guildid = $1;`, [String(msg.guildId)])
    .then((r: DBT.levelingruleschannels[] | null) => r || null);

  if (!levelingruleschannelsRows) return null;

  const rows = levelingruleschannelsRows.filter((r) => r.channels?.includes(String(msg.channelId)));
  return rows;
};

type AppliedRules = {
  [key in keyof typeof ActivityFlags]?: number;
};

const checkPass = (msg: CT.MessageGuild, rows: DBT.levelingruleschannels[]) => {
  const passes = rows.map((row) => {
    if (!row.rules) return true;
    const rules = new ChannelRules(Number(row.rules)).toArray();
    const appliedRules: AppliedRules = {};

    rules.forEach((nameKey) => {
      const key = nameKey.toLowerCase();
      const rule = row[key as never];
      appliedRules[key as never] = rule;
    });

    const willLevel: boolean[] = [];

    Object.entries(appliedRules).forEach(([key, num]) => {
      switch (key) {
        case 'hasleastattachments': {
          if (msg.attachments.length < Number(num)) willLevel.push(false);
          break;
        }
        case 'hasmostattachments': {
          if (msg.attachments.length > Number(num)) willLevel.push(false);
          break;
        }
        case 'hasleastcharacters': {
          if (msg.content.length < Number(num)) willLevel.push(false);
          break;
        }
        case 'hasmostcharacters': {
          if (msg.content.length > Number(num)) willLevel.push(false);
          break;
        }
        case 'hasleastwords': {
          if (msg.content.split(' ').length < Number(num)) willLevel.push(false);
          break;
        }
        case 'hasmostwords': {
          if (msg.content.split(' ').length > Number(num)) willLevel.push(false);
          break;
        }
        case 'mentionsleastusers': {
          if (msg.mentionedUserIds.length < Number(num)) willLevel.push(false);
          break;
        }
        case 'mentionsmostusers': {
          if (msg.mentionedUserIds.length > Number(num)) willLevel.push(false);
          break;
        }
        case 'mentionsleastroles': {
          if (msg.mentionedRoleIds.length < Number(num)) willLevel.push(false);
          break;
        }
        case 'mentionsmostroles': {
          if (msg.mentionedRoleIds.length > Number(num)) willLevel.push(false);
          break;
        }
        case 'mentionsleastchannels': {
          if (msg.mentionedChannelIds.length < Number(num)) willLevel.push(false);
          break;
        }
        case 'mentionsmostchannels': {
          if (msg.mentionedChannelIds.length > Number(num)) willLevel.push(false);
          break;
        }
        case 'hasleastlinks': {
          if (
            Number(
              msg.content.match(
                /(http|https):\/\/(?:[a-z0-9]+(?:[-][a-z0-9]+)*\.)+[a-z]{2,}(?::\d+)?(?:\/\S*)?/gi,
              )?.length || null,
            ) < Number(num)
          ) {
            willLevel.push(false);
          }
          break;
        }
        case 'hasmostlinks': {
          if (
            Number(
              msg.content.match(
                /(http|https):\/\/(?:[a-z0-9]+(?:[-][a-z0-9]+)*\.)+[a-z]{2,}(?::\d+)?(?:\/\S*)?/gi,
              )?.length || null,
            ) > Number(num)
          ) {
            willLevel.push(false);
          }
          break;
        }
        case 'hasleastemotes': {
          if (
            Number(msg.content.match(/<(a)?:[a-zA-Z0-9_]+:[0-9]+>/gi)?.length || null) < Number(num)
          ) {
            willLevel.push(false);
          }
          break;
        }
        case 'hasmostemotes': {
          if (
            Number(msg.content.match(/<(a)?:[a-zA-Z0-9_]+:[0-9]+>/gi)?.length || null) > Number(num)
          ) {
            willLevel.push(false);
          }
          break;
        }
        case 'hasleastmentions': {
          if (
            msg.mentionedUserIds.length +
              msg.mentionedRoleIds.length +
              msg.mentionedChannelIds.length <
            Number(num)
          ) {
            willLevel.push(false);
          }
          break;
        }
        case 'hasmostmentions': {
          if (
            msg.mentionedUserIds.length +
              msg.mentionedRoleIds.length +
              msg.mentionedChannelIds.length >
            Number(num)
          ) {
            willLevel.push(false);
          }
          break;
        }
        default: {
          willLevel.push(true);
          break;
        }
      }
      willLevel.push(true);
    });
    if (willLevel.includes(false)) return false;
    return true;
  });

  if (passes.includes(false)) return false;
  return true;
};

const getRoleMultiplier = async (msg: CT.MessageGuild) => {
  const levelingmultiplierrolesRows = await client.ch
    .query(`SELECT * FROM levelingmultiplierroles WHERE guildid = $1 ORDER BY multiplier DESC;`, [
      String(msg.guildId),
    ])
    .then((r: DBT.levelingmultiplierroles[] | null) => r || null);

  if (levelingmultiplierrolesRows) {
    const rows = levelingmultiplierrolesRows.filter((row) =>
      msg.member?.roles.some((r) => row.roles?.includes(String(r))),
    );
    if (!rows || !rows.length) return null;
    const [row] = rows;
    return Number(row.multiplier);
  }
  return null;
};

const getChannelMultiplier = async (msg: CT.MessageGuild) => {
  const allRows = await client.ch
    .query(
      `SELECT * FROM levelingmultiplierchannels WHERE guildid = $1 ORDER BY multiplier DESC;`,
      [String(msg.guildId)],
    )
    .then((r: DBT.levelingmultiplierchannels[] | null) => r || null);

  if (allRows) {
    const rows = allRows.filter((row) => row.channels?.includes(String(msg.channelId)));
    if (!rows || !rows.length) return null;
    const [row] = rows;
    return Number(row.multiplier);
  }
  return null;
};

const infoEmbed = async (msg: CT.MessageGuild, reactions: DDeno.Emoji[] | null) => {
  const embed: DDeno.Embed = {
    type: 'rich',
    color: await client.ch.colorSelector(await client.cache.members.get(client.id, msg.guildId)),
    description: client.ch.stp(msg.language.leveling.description, {
      reactions: reactions?.join(''),
    }),
  };

  client.ch.replyMsg(msg, { embeds: [embed] }).then((m) => {
    const date = new Date(Date.now() + 30000);
    jobs.scheduleJob(date, () => {
      if (m) client.helpers.deleteMessage(m.channelId, m.id, msg.language.deleteReasons.leveling);
    });
  });
};

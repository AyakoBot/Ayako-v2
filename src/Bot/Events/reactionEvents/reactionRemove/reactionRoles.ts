import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (reaction: CT.ReactionRemove) => {
  if (reaction.userId === client.id) return;
  if (!reaction.guildId) return;

  const emoteIdentifier = reaction.emoji.toggles.requireColons
    ? reaction.emoji.id
    : reaction.emoji.name;
  if (!emoteIdentifier) return;

  const baseRow = await getBaseRow(reaction);
  if (!baseRow) return;

  const reactionRows = await getReactionRows(reaction, emoteIdentifier);
  if (!reactionRows) return;

  const member = await client.cache.members.get(reaction.userId, reaction.guildId);
  if (!member) return;

  const relatedReactions = await getRelatedReactions(reaction, reactionRows);
  const hasAnyOfRelated = getHasAnyOfRelated(relatedReactions, member);

  reactionRows.forEach((reactionRow) => {
    removeRoles(reactionRow, baseRow, hasAnyOfRelated, member);
  });
};

const getBaseRow = (reaction: CT.ReactionAdd) =>
  client.ch
    .query(
      `SELECT * FROM rrsettings WHERE msgid = $1 AND guildid = $2 AND channelid = $3 AND active = true;`,
      [String(reaction.messageId), String(reaction.guildId), String(reaction.channelId)],
    )
    .then((r: DBT.rrsettings[] | null) => (r ? r[0] : null));

const getReactionRows = (reaction: CT.ReactionAdd, emoteIdentifier: string | bigint) =>
  client.ch
    .query(
      'SELECT * FROM rrreactions WHERE emoteid = $1 AND msgid = $2 AND guildid = $3 AND channelid = $4 AND active = true;',
      [
        String(emoteIdentifier),
        String(reaction.messageId),
        String(reaction.guildId),
        String(reaction.channelId),
      ],
    )
    .then((r: DBT.rrreactions[] | null) => r || null);

const getRelatedReactions = async (reaction: CT.ReactionAdd, reactionRows: DBT.rrreactions[]) => {
  const buttonRows = await client.ch
    .query(
      `SELECT * FROM rrbuttons WHERE msgid = $1 AND guildid = $2 AND channelid = $3 AND active = true;`,
      [String(reaction.messageId), String(reaction.guildId), String(reaction.channelId)],
    )
    .then((r: DBT.rrbuttons[] | null) => r || []);

  return [...reactionRows, ...buttonRows];
};

const getHasAnyOfRelated = (
  relatedReactions: (DBT.rrreactions | DBT.rrbuttons)[],
  member: DDeno.Member,
) => {
  if (!relatedReactions || !relatedReactions.length) return false;

  let hasAnyOfRelated = false;

  relatedReactions.forEach((row) => {
    row.roles?.map(BigInt).forEach((role) => {
      if (hasAnyOfRelated) return;
      if (member.roles.includes(role)) hasAnyOfRelated = true;
    });
  });

  return hasAnyOfRelated;
};

const removeRoles = async (
  reactionRow: DBT.rrreactions,
  baseRow: DBT.rrsettings,
  hasAnyOfRelated: boolean,
  member: DDeno.Member,
) => {
  const rolesToRemove: bigint[] = [];

  reactionRow.roles?.map(BigInt).forEach((rID) => {
    if (!member.roles.includes(rID)) rolesToRemove.push(rID);
  });

  if (hasAnyOfRelated && baseRow.anyroles && baseRow.anyroles.length) {
    baseRow.anyroles.map(BigInt).forEach((rID) => {
      if (!member.roles.includes(rID)) rolesToRemove.push(rID);
    });
  }

  if (rolesToRemove.length) {
    const language = await client.ch.languageSelector(member.guildId);
    client.ch.roleManager.remove(
      member,
      rolesToRemove,
      language.events.messageReactionRemove.rrReason,
    );
  }
};

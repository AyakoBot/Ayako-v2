import type * as Discord from 'discord.js';
import type DBT from '../../../Typings/DataBaseTypings';
import client from '../../../BaseClient/Client.js';

export default async (
  reaction: Discord.MessageReaction,
  user: Discord.User,
  msg: Discord.Message,
) => {
  if (user.id === client.user?.id) return;
  if (!msg.guild) return;

  const emoteIdentifier = reaction.emoji.id ?? reaction.emoji.name;
  if (!emoteIdentifier) return;

  const baseRow = await getBaseRow(reaction);
  if (!baseRow) return;

  const reactionRows = await getReactionRows(reaction, emoteIdentifier);
  if (!reactionRows) return;

  const member = await msg.guild.members.fetch(user.id);
  if (!member) return;

  const relatedReactions = await getRelatedReactions(reaction, reactionRows);
  const hasAnyOfRelated = getHasAnyOfRelated(relatedReactions, member);

  reactionRows.forEach((reactionRow) => {
    if (
      (!hasAnyOfRelated && baseRow.onlyone && reactionRow.roles) ||
      (!baseRow.onlyone && reactionRow.roles)
    ) {
      giveRoles(reactionRow, baseRow, hasAnyOfRelated, member);
    }
  });
};

const getBaseRow = (reaction: Discord.MessageReaction) =>
  client.ch
    .query(
      `SELECT * FROM rrsettings WHERE msgid = $1 AND guildid = $2 AND channelid = $3 AND active = true;`,
      [reaction.message.id, reaction.message.guild?.id, reaction.message.channel.id],
    )
    .then((r: DBT.rrsettings[] | null) => (r ? r[0] : null));

const getReactionRows = (reaction: Discord.MessageReaction, emoteIdentifier: string) =>
  client.ch
    .query(
      'SELECT * FROM rrreactions WHERE emoteid = $1 AND msgid = $2 AND guildid = $3 AND channelid = $4 AND active = true;',
      [
        emoteIdentifier,
        reaction.message.id,
        reaction.message.guild?.id,
        reaction.message.channel.id,
      ],
    )
    .then((r: DBT.rrreactions[] | null) => r || null);

const getRelatedReactions = async (
  reaction: Discord.MessageReaction,
  reactionRows: DBT.rrreactions[],
) => {
  const buttonRows = await client.ch
    .query(
      `SELECT * FROM rrbuttons WHERE msgid = $1 AND guildid = $2 AND channelid = $3 AND active = true;`,
      [reaction.message.id, reaction.message.guild?.id, reaction.message.channel.id],
    )
    .then((r: DBT.rrbuttons[] | null) => r || []);

  return [...reactionRows, ...buttonRows];
};

const getHasAnyOfRelated = (
  relatedReactions: (DBT.rrreactions | DBT.rrbuttons)[],
  member: Discord.GuildMember,
) => {
  if (!relatedReactions || !relatedReactions.length) return false;

  let hasAnyOfRelated = false;

  relatedReactions.forEach((row) => {
    row.roles?.forEach((role) => {
      if (hasAnyOfRelated) return;
      if (member.roles.cache.has(role)) hasAnyOfRelated = true;
    });
  });

  return hasAnyOfRelated;
};

const giveRoles = async (
  reactionRow: DBT.rrreactions,
  baseRow: DBT.rrsettings,
  hasAnyOfRelated: boolean,
  member: Discord.GuildMember,
) => {
  const rolesToAdd: string[] = [];

  reactionRow.roles?.forEach((rID) => {
    if (!member.roles.cache.has(rID)) rolesToAdd.push(rID);
  });

  if (hasAnyOfRelated && baseRow.anyroles && baseRow.anyroles.length) {
    baseRow.anyroles.forEach((rID) => {
      if (!member.roles.cache.has(rID)) rolesToAdd.push(rID);
    });
  }

  if (rolesToAdd.length) {
    const language = await client.ch.languageSelector(member.guild.id);
    client.ch.roleManager.add(member, rolesToAdd, language.events.messageReactionAdd.rrReason);
  }
};

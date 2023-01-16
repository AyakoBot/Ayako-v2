import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import client from '../../../BaseClient/DDenoClient.js';

const giveawayTitle = 'Mega Giveaway!';
const hostIcon =
  'https://cdn.discordapp.com/attachments/764376037751521290/987061511769964634/unknown.png';
const giveawayLink = 'https://clik.cc/A3KLb/';

export default async (reaction: CT.ReactionAdd) => {
  if (reaction.userId === client.id) return;
  if (!reaction.guildId) return;
  if (reaction.channelId !== 979811225212956722n) return;

  const member = await client.ch.cache.members.get(reaction.userId, reaction.guildId);
  if (!member) return;

  if (
    !member.roles.includes(278332463141355520n) &&
    !member.roles.includes(293928278845030410n) &&
    !member.roles.includes(768540224615612437n)
  ) {
    return;
  }

  const logchannel = await client.ch.cache.channels.get(805860525300776980n, 108176345204264960n);
  if (!logchannel) return;

  const statsRow = await client.ch
    .query('SELECT * FROM stats;')
    .then((r: DBT.stats[] | null) => (r ? r[0] : null));
  if (!statsRow) return;

  switch (reaction.emoji.name) {
    case '✅': {
      const tick = async () => {
        if (!reaction.guildId) return;
        client.helpers.deleteMessage(reaction.channelId, reaction.messageId).catch(() => null);

        const user = await client.ch.cache.users.get(reaction.userId);
        if (!user) return;

        const msg = await client.ch.cache.messages.get(
          reaction.messageId,
          reaction.channelId,
          reaction.guildId,
        );
        if (!msg) return;

        const author = await client.ch.cache.users.get(msg.authorId);
        if (!author) return;

        const embed: DDeno.Embed = {
          color: client.customConstants.standard.color,
          thumbnail: { url: client.ch.getAvatarURL(user) },
          description: `<@${user.id}> accepted the submission of <@${author.id}>`,
          author: { name: author.username, iconUrl: client.ch.getAvatarURL(author) },
        };

        const language = await client.ch.languageSelector(reaction.guildId);
        await client.ch.send(logchannel, { embeds: [embed] }, language);

        if (statsRow.willis?.map(BigInt).includes(author.id)) {
          const DM: DDeno.Embed = {
            author: {
              name: giveawayTitle,
              iconUrl: hostIcon,
              url: client.customConstants.standard.invite,
            },
            description: '**You already entered the Giveaway!**',
            color: 16776960,
            fields: [
              {
                name: '\u200b',
                value: `[Click here to get to the Giveaway](${giveawayLink})`,
                inline: false,
              },
            ],
          };

          const dmChannel = await client.helpers.getDmChannel(author.id);
          await client.ch.send(await dmChannel, { embeds: [DM] }, language);
          return;
        }

        const arr: string[] = [];
        if (statsRow.willis?.length) {
          arr.push(...statsRow.willis, String(author.id));
        }

        const DM: DDeno.Embed = {
          author: {
            name: giveawayTitle,
            iconUrl: hostIcon,
            url: client.customConstants.standard.invite,
          },
          description: '**Your submission was accepted!**\nGood Luck!',
          color: client.customConstants.standard.color,
        };

        const dmChannel = await client.helpers.getDmChannel(author.id);
        await client.ch.send(dmChannel, { embeds: [DM] }, language);

        client.ch.query('UPDATE stats SET willis = $1, count = $2;', [arr, arr.length]);
      };

      tick();
      break;
    }
    case '❌': {
      const cross = async () => {
        if (!reaction.guildId) return;
        client.helpers.deleteMessage(reaction.channelId, reaction.messageId).catch(() => null);

        const user = await client.ch.cache.users.get(reaction.userId);
        if (!user) return;

        const msg = await client.ch.cache.messages.get(
          reaction.messageId,
          reaction.channelId,
          reaction.guildId,
        );
        if (!msg) return;

        const author = await client.ch.cache.users.get(msg.authorId);
        if (!author) return;

        const embed: DDeno.Embed = {
          color: 16711680,
          thumbnail: { url: client.ch.getAvatarURL(user) },
          description: `<@${user.id}> rejected the submission of <@${author.id}>`,
          author: { name: author.username, iconUrl: client.ch.getAvatarURL(author) },
        };

        const language = await client.ch.languageSelector(reaction.guildId);
        await client.ch.send(logchannel, { embeds: [embed] }, language);

        const DM: DDeno.Embed = {
          author: {
            name: giveawayTitle,
            iconUrl: hostIcon,
            url: client.customConstants.standard.invite,
          },
          description: '**Your submission was rejected!**',
          color: 16711680,
          fields: [
            {
              name: 'Please check back on the requirements',
              value: '\u200b',
            },
          ],
        };

        const dmChannel = await client.helpers.getDmChannel(author.id);
        await client.ch.send(dmChannel, { embeds: [DM] }, language);
      };

      cross();
      break;
    }
    default: {
      break;
    }
  }
};

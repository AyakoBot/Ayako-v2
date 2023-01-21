import type * as Discord from 'discord.js';
import type DBT from '../../../Typings/DataBaseTypings';
import client from '../../../BaseClient/Client.js';

const giveawayTitle = 'Mega Giveaway!';
const hostIcon =
  'https://cdn.discordapp.com/attachments/764376037751521290/987061511769964634/unknown.png';
const giveawayLink = 'https://clik.cc/A3KLb/';

export default async (
  reaction: Discord.MessageReaction,
  user: Discord.User,
  msg: Discord.Message,
) => {
  if (user.id === client.user?.id) return;
  if (!msg.guild?.id) return;
  if (msg.channel.id !== '979811225212956722') return;

  const member = await msg.guild.members.fetch(user.id);
  if (!member) return;

  if (
    !member.roles.cache.has('278332463141355520') &&
    !member.roles.cache.has('293928278845030410') &&
    !member.roles.cache.has('768540224615612437')
  ) {
    return;
  }

  const logchannel = await client.ch.getChannel.guildTextChannel('805860525300776980');
  if (!logchannel) return;

  const statsRow = await client.ch
    .query('SELECT * FROM stats;')
    .then((r: DBT.stats[] | null) => (r ? r[0] : null));
  if (!statsRow) return;

  switch (reaction.emoji.name) {
    case '✅': {
      const tick = async () => {
        msg.delete().catch(() => null);

        const embed: Discord.APIEmbed = {
          color: client.customConstants.standard.color,
          thumbnail: { url: user.displayAvatarURL({ size: 4096 }) },
          description: `<@${user.id}> accepted the submission of <@${msg.author.id}>`,
          author: {
            name: msg.author.username,
            icon_url: msg.author.displayAvatarURL({ size: 4096 }),
          },
        };

        const language = await client.ch.languageSelector(msg.guild?.id);
        await client.ch.send(logchannel, { embeds: [embed] }, language);

        if (statsRow.willis?.includes(msg.author.id)) {
          const DM: Discord.APIEmbed = {
            author: {
              name: giveawayTitle,
              icon_url: hostIcon,
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

          const dmChannel = await msg.author.createDM();
          await client.ch.send(dmChannel, { embeds: [DM] }, language);
          return;
        }

        const arr: string[] = [];
        if (statsRow.willis?.length && msg.guild) {
          arr.push(...statsRow.willis, msg.guild.id);
        }

        const DM: Discord.APIEmbed = {
          author: {
            name: giveawayTitle,
            icon_url: hostIcon,
            url: client.customConstants.standard.invite,
          },
          description: '**Your submission was accepted!**\nGood Luck!',
          color: client.customConstants.standard.color,
        };

        const dmChannel = await msg.author.createDM();
        await client.ch.send(dmChannel, { embeds: [DM] }, language);

        client.ch.query('UPDATE stats SET willis = $1, count = $2;', [arr, arr.length]);
      };

      tick();
      break;
    }
    case '❌': {
      const cross = async () => {
        msg.delete().catch(() => null);

        const embed: Discord.APIEmbed = {
          color: 16711680,
          thumbnail: { url: user.displayAvatarURL({ size: 4096 }) },
          description: `<@${user.id}> rejected the submission of <@${msg.author.id}>`,
          author: {
            name: msg.author.username,
            icon_url: msg.author.displayAvatarURL({ size: 4096 }),
          },
        };

        const language = await client.ch.languageSelector(msg.guild?.id);
        await client.ch.send(logchannel, { embeds: [embed] }, language);

        const DM: Discord.APIEmbed = {
          author: {
            name: giveawayTitle,
            icon_url: hostIcon,
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

        const dmChannel = await msg.author.createDM();
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

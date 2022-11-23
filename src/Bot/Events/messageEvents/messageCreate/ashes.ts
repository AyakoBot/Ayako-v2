import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient';

export default async (msg: CT.MessageGuild) => {
  rolePing(msg);
  banHandler(msg);
};

const banHandler = async (msg: CT.MessageGuild) => {
  if (msg.authorId !== 868115102681956404n) return;
  if (msg.channelId !== 757879586439823440n) return;
  if (!msg.content.includes('@Known-Scammers ping:')) return;

  const isUnban = msg.content.includes('REMOVAL FROM LIST');
  const executor = await client.cache.users.get(646937666251915264n);

  const ids = msg.content.match(/\d{17,19}/gm);
  if (!ids || !ids.length) return;

  ids.forEach(async (id) => {
    const user = await client.cache.users.get(BigInt(id));
    if (!user) {
      const language = await client.ch.languageSelector(msg.guildId);
      client.ch.errorMsg(msg, language.errors.userNotFound, language);
      return;
    }

    const reasonArgs = msg.content.replace(/```/g, '').split(/:/);
    const reason = reasonArgs[reasonArgs.findIndex((c) => c.includes('Reason')) + 1];

    if (!msg.guildId) return;

    if (isUnban) {
      (await import('../../modBaseEvent.js')).default({
        target: user,
        executor: executor || (await client.cache.users.get(client.id)),
        reason,
        msg,
        guild: await client.cache.guilds.get(msg.guildId),
        type: 'banRemove',
      });
    } else {
      (await import('../../modBaseEvent.js')).default({
        target: user,
        executor: executor || (await client.cache.users.get(client.id)),
        reason,
        msg,
        guild: await client.cache.guilds.get(msg.guildId),
        type: 'banAdd',
      });
    }
  });
};

const rolePing = (msg: CT.MessageGuild) => {
  if (msg.channelId !== 757879586439823440n) return;
  if (msg.authorId !== 646937666251915264n) return;

  let content = '';

  if (msg.content.includes('since this server is currently active')) {
    content = '<@&893986129773207582> Karuta has dropped Cards! Move or lose.';
  }

  if (msg.content.includes('A card from your wishlist is dropping')) {
    content = '<@&893986129773207582> a wished Card was dropped! Move or lose.';
  }

  if (!content) return;

  client.ch.replyMsg(msg, { content, allowedMentions: { roles: [893986129773207582n] } });
};

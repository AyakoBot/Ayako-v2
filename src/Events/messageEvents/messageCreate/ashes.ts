import type CT from '../../../Typings/CustomTypings';
import { ch, client } from '../../../BaseClient/Client';

export default async (msg: CT.GuildMessage) => {
  rolePing(msg);
  banHandler(msg);
};

const banHandler = async (msg: CT.GuildMessage) => {
  if (msg.author.id !== '868115102681956404') return;
  if (msg.channelId !== '757879586439823440') return;
  if (!msg.content.includes('@Known-Scammers ping:')) return;

  const isUnban = msg.content.includes('REMOVAL FROM LIST');
  const executor = await client.users.fetch('646937666251915264');

  const ids = msg.content.match(/\d{17,19}/gm);
  if (!ids || !ids.length) return;

  ids.forEach(async (id) => {
    const user = await client.users.fetch(id);
    if (!user) {
      const language = await ch.languageSelector(msg.guild.id);
      ch.errorMsg(msg, language.errors.userNotFound, language);
      return;
    }

    const reasonArgs = msg.content.replace(/```/g, '').split(/:/);
    const reason = reasonArgs[reasonArgs.findIndex((c) => c.includes('Reason')) + 1];

    if (!msg.guild.id) return;
    if (!client.user?.id) return;

    if (isUnban) {
      (await import('../../modBaseEvent.js')).default({
        target: user,
        executor: executor || (await client.users.fetch(client.user.id)),
        reason,
        msg,
        guild: msg.guild,
        type: 'banRemove',
      });
    } else {
      (await import('../../modBaseEvent.js')).default({
        target: user,
        executor: executor || (await client.users.fetch(client.user.id)),
        reason,
        msg,
        guild: msg.guild,
        type: 'banAdd',
      });
    }
  });
};

const rolePing = (msg: CT.GuildMessage) => {
  if (!['808095830677782558', '757879586439823440'].includes(msg.channelId)) return;
  if (msg.author.id !== '646937666251915264n') return;

  const getRole = () => {
    if (msg.channelId === '757879586439823440') return '893986129773207582';
    if (msg.channelId === '808095830677782558') return '1059212168962257068';
    return undefined;
  };

  let content = '';
  const role = getRole();
  if (!role) return;

  if (msg.content.includes('since this server is currently active')) {
    content = `<@&${role}> Karuta has dropped Cards! Move or lose.`;
  }

  if (msg.content.includes('A card from your wishlist is dropping')) {
    content = `<@&${role}> a wished Card was dropped! Move or lose.`;
  }

  if (!content) return;

  ch.replyMsg(msg, { content, allowedMentions: { roles: [role] } });
};

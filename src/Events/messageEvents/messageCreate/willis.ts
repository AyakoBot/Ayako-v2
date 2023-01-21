import type CT from '../../../Typings/CustomTypings';

export default (msg: CT.GuildMessage) => {
  if (!msg.member) return;
  if (msg.channel.id !== '979811225212956722') return;
  if (msg.member.roles.cache.has('293928278845030410')) return;
  if (msg.member.roles.cache.has('278332463141355520')) return;
  if (msg.attachments.size) return;

  msg.delete().catch(() => null);
};

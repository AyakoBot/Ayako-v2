import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../Typings/CustomTypings';

export default async (msg: Discord.Message) => {
 rolePing(msg);
 banHandler(msg);
};

const banHandler = async (msg: Discord.Message) => {
 if (msg.author.id !== '868115102681956404') return;
 if (msg.channelId !== '757879586439823440') return;
 if (!msg.inCachedGuild()) return;
 if (!msg.content.includes('@Known-Scammers ping:')) return;

 const isUnban = msg.content.includes('REMOVAL FROM LIST');
 const executor = await ch.getUser('646937666251915264');

 const ids = msg.content.match(/\d{17,19}/gm);
 if (!ids || !ids.length) return;

 ids.forEach(async (id) => {
  const user = await ch.getUser(id);
  if (!user) {
   const language = await ch.languageSelector(msg.guildId);
   ch.errorMsg(msg, language.errors.userNotFound, language);
   return;
  }

  const reasonArgs = msg.content.replace(/```/g, '').split(/:/);
  const reason = reasonArgs[reasonArgs.findIndex((c) => c.includes('Reason')) + 1];

  if (!msg.guildId) return;
  if (!client.user?.id) return;

  const modOptions: CT.ModBaseEventOptions = {
   target: user,
   executor: executor || (await ch.getUser(client.user.id)),
   reason,
   msg,
   guild: msg.guild,
   type: isUnban ? 'banRemove' : 'banAdd',
  };

  client.emit('modBaseEvent', modOptions);
 });
};

const rolePing = (msg: Discord.Message) => {
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

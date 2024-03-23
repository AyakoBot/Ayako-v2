import Discord from 'discord.js';
import jobs from 'node-schedule';
import client from '../../../../BaseClient/Bot/Client.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';

export default async (msg: Discord.Message<true>) => {
 if (msg.author.discriminator === '0000') return;

 gvMessageCheck(msg);
 amMessageCheck(msg);
 amInproperStaffPingIdiot(msg);

 if (
  (msg.channelId === '554487212276842534' || msg.channelId === '791390835916537906') &&
  msg.attachments.size < 1 &&
  !msg.member?.roles.cache.has('366238244775657472') &&
  !msg.member?.roles.cache.has('776248679363248168') &&
  msg.author.id !== client.user?.id
 ) {
  msg.client.util.request.channels.deleteMessage(msg);
 }

 const pin = () => {
  if (msg.channel.id !== '1060213963205394552') return;
  setTimeout(() => {
   if (!msg.pinned) msg.client.util.request.channels.deleteMessage(msg);
  }, 5000);
 };
 pin();
};

const gvMessageCheck = (msg: Discord.Message<true>) => {
 if (!msg.member) return;
 if (!new Discord.PermissionsBitField(msg.member.permissions)?.has(32n)) return;
 if (msg.guildId !== '366219406776336385') return;
 if (msg.channelId === '801804774759727134') return;

 const inviteCheck = () => {
  if (msg.author.bot) return;

  if (!msg.content.toLocaleLowerCase().includes('discord.gg/')) return;
  msg.client.util.request.channels.deleteMessage(msg);

  msg.client.util
   .send(msg.channel, {
    content: `${msg.author} **Do not send Discord Links in this Channel**`,
   })
   .then((m) => {
    if (Array.isArray(m)) return;
    jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), () => {
     if (m) msg.client.util.request.channels.deleteMessage(m as Discord.Message<true>);
    });
   });
 };

 const linkCheck = () => {
  if (msg.author.bot) return;

  if (
   msg.content.toLowerCase().startsWith('https://') &&
   msg.content.toLowerCase().startsWith('http://')
  ) {
   return;
  }
  if (
   msg.member?.roles.cache.has('369619820867747844') ||
   msg.member?.roles.cache.has('367781331683508224') ||
   msg.member?.roles.cache.has('585576789376630827') ||
   msg.channelId === '367403201646952450' ||
   msg.channelId === '77766025920027037'
  ) {
   return;
  }

  msg.client.util.request.channels.deleteMessage(msg);

  msg.client.util
   .send(msg.channel, {
    content: `${msg.author} You are not allowed to post links yet. \`Needed level: Donut [40]\`\n Please use <#298954962699026432> and <#348601610244587531> instead.`,
   })
   .then((m) => {
    if (Array.isArray(m)) return;
    jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), () => {
     if (m) msg.client.util.request.channels.deleteMessage(m as Discord.Message<true>);
    });
   });
 };

 inviteCheck();
 linkCheck();
};

const amMessageCheck = (msg: Discord.Message<true>) => {
 const staffPing = async () => {
  if (msg.author.bot) return;
  if (!msg.content.includes('<@&809261905855643668>')) return;

  msg.client.util.send(msg.channel, {
   content: msg.guild?.roles.cache
    .get('809261905855643668')
    ?.members.map((m) => `<@${m.id}>`)
    .join(', '),
   allowed_mentions: {
    users: msg.guild?.roles.cache.get('809261905855643668')?.members.map((m) => m.id),
   },
  });
 };
 staffPing();

 const intros = async () => {
  if (msg.channel?.id !== '763132467041140737') return;
  if (msg.author.bot) return;

  const messages = await msg.client.util.request.channels
   .getMessages(msg.channel as Discord.GuildTextBasedChannel, { limit: 100 })
   .then((msgs) => ('message' in msgs ? undefined : msgs.map((m) => m)));
  const messagesFromSameAuthor = messages?.filter((m) => m.author.id === msg.author.id);

  if (Number(messagesFromSameAuthor?.length) > 1) {
   const reply = (await msg.client.util.replyMsg(msg, {
    content:
     '__We appreciate your enthusiasm, but you have already sent an introduction!__\nIf you want to refresh your intro, please wait a little longer before posting again\nYou have 20 Seconds before your intro is deleted. **Copy and Save it for later.**',
    allowed_mentions: {
     replied_user: true,
    },
   })) as Discord.Message<true>;

   setTimeout(() => {
    msg.client.util.request.channels.deleteMessage(msg);
    msg.client.util.request.channels.deleteMessage(reply);
   }, 20000);
  }
 };
 intros();

 const levelUp = () => {
  if (msg.author.id !== '159985870458322944' && msg.author.id !== '172002275412279296') {
   return;
  }

  if (!msg.content.includes(' is now level ') || !msg.content.includes(' leveled up!')) return;
  if (Number(msg.content?.split(/ +/)[4].replace(/!/g, '')) > 39) return;

  jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), () => {
   msg.client.util.request.channels.deleteMessage(msg);
  });
 };

 levelUp();
};

const amInproperStaffPingIdiot = async (msg: Discord.Message) => {
 if (msg.author.bot) return;
 if (!msg.inGuild()) return;
 if (msg.guildId !== '298954459172700181') return;

 const roleMembers = msg.guild?.roles.cache.get('809261905855643668')?.members.map((m) => m.id);
 if (roleMembers?.includes(msg.author.id)) return;
 if (!roleMembers) return;
 if (!msg.mentions.members?.hasAny(...roleMembers)) return;

 const oldMessages = await msg.client.util.request.channels.getMessages(msg.channel, {
  limit: 100,
 });
 if ('message' in oldMessages) return;

 const mentionedStaff = msg.mentions.members.filter((m) => roleMembers.includes(m.id));
 if (mentionedStaff.hasAny(...oldMessages.map((m) => m.author.id))) return;

 const m = (await msg.client.util.replyMsg(msg, {
  content:
   '## If you see any rule violation, please be sure to mention the Staff Role, not a single Staff Member.',
  allowed_mentions: {
   replied_user: true,
  },
 })) as Discord.Message<true>;

 jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), async () => {
  if (!m) return;
  if (await msg.client.util.isDeleteable(m)) msg.client.util.request.channels.deleteMessage(m);
 });
};

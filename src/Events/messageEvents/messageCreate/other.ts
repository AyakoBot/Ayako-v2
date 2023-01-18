import Discord from 'discord.js';
import jobs from 'node-schedule';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (msg: CT.MessageGuild) => {
  gvMessageCheck(msg);
  amMessageCheck(msg);

  if (
    (msg.channelId === 554487212276842534n || msg.channelId === 791390835916537906n) &&
    msg.attachments.length < 1 &&
    !msg.member.roles.includes(366238244775657472n) &&
    !msg.member.roles.includes(776248679363248168n) &&
    msg.authorId !== client.id
  ) {
    client.helpers.deleteMessage(msg.channelId, msg.id).catch(() => null);
  }
};

const gvMessageCheck = (msg: CT.MessageGuild) => {
  if (!new Discord.PermissionsBitField(msg.member.permissions)?.has(32n)) return;
  if (msg.guild.id !== 366219406776336385n) return;
  if (msg.channelId === 801804774759727134n) return;

  const inviteCheck = () => {
    if (!msg.content.toLocaleLowerCase().includes('discord.gg/')) return;
    client.helpers.deleteMessage(msg.channelId, msg.id).catch(() => null);

    client.ch
      .send(
        msg.channel,
        { content: `${msg.author} **Do not send Discord Links in this Channel**` },
        msg.language,
      )
      .then((m) => {
        if (Array.isArray(m)) return;
        jobs.scheduleJob(new Date(Date.now() + 10000), () => {
          if (m) client.helpers.deleteMessage(m.channelId, m.id).catch(() => null);
        });
      });
  };

  const linkCheck = () => {
    if (
      msg.content.toLowerCase().startsWith('https://') &&
      msg.content.toLowerCase().startsWith('http://')
    ) {
      return;
    }
    if (
      msg.member.roles.includes(369619820867747844n) ||
      msg.member.roles.includes(367781331683508224n) ||
      msg.member.roles.includes(585576789376630827n) ||
      msg.channelId === 367403201646952450n ||
      msg.channelId === 77766025920027037n
    ) {
      return;
    }

    client.helpers.deleteMessage(msg.channelId, msg.id).catch(() => null);
    client.ch
      .send(
        msg.channel,
        {
          content: `${msg.author} You are not allowed to post links yet. \`Needed level: Donut [40]\`\n Please use <#298954962699026432> and <#348601610244587531> instead.`,
        },
        msg.language,
      )
      .then((m) => {
        if (Array.isArray(m)) return;
        jobs.scheduleJob(new Date(Date.now() + 10000), () => {
          if (m) client.helpers.deleteMessage(m.channelId, m.id).catch(() => null);
        });
      });
  };

  inviteCheck();
  linkCheck();
};

const amMessageCheck = (msg: CT.MessageGuild) => {
  if (!msg.content.includes(' is now level ') || !msg.content.includes(' leveled up!')) return;
  if (Number(msg.content?.split(/ +/)[4].replace(/!/g, '')) > 39) return;

  const levelUp = () => {
    if (msg.authorId !== 159985870458322944n && msg.authorId !== 172002275412279296n) {
      return;
    }

    jobs.scheduleJob(new Date(Date.now() + 10000), () => {
      client.helpers.deleteMessage(msg.channelId, msg.id).catch(() => null);
    });
  };

  const linkCheck = () => {
    if (msg.channelId !== 298954459172700181n) return;
    if (
      !msg.content.toLocaleLowerCase().includes('http://') &&
      !msg.content.toLocaleLowerCase().includes('https://')
    ) {
      return;
    }

    if (msg.member.roles.includes(334832484581769217n)) return;
    if (msg.member.roles.includes(606164114691194900n)) return;

    client.ch
      .send(
        msg.channel,
        {
          content: `${msg.author} You are not allowed to post links yet. \`Needed level: Cookie [20]\`\n Please use <#298954962699026432> and <#348601610244587531> instead.`,
        },
        msg.language,
      )
      .then((m) => {
        if (Array.isArray(m)) return;
        jobs.scheduleJob(new Date(Date.now() + 10000), () => {
          if (m) client.helpers.deleteMessage(m.channelId, m.id).catch(() => null);
        });
      });
  };

  levelUp();
  linkCheck();
};

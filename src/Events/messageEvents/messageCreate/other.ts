import Discord from 'discord.js';
import jobs from 'node-schedule';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (msg: CT.GuildMessage) => {
  gvMessageCheck(msg);
  amMessageCheck(msg);

  if (
    (msg.channelId === '554487212276842534' || msg.channelId === '791390835916537906') &&
    msg.attachments.size < 1 &&
    !msg.member.roles.cache.has('366238244775657472') &&
    !msg.member.roles.cache.has('776248679363248168') &&
    msg.author.id !== client.user?.id
  ) {
    msg.delete().catch(() => null);
  }
};

const gvMessageCheck = (msg: CT.GuildMessage) => {
  if (!new Discord.PermissionsBitField(msg.member.permissions)?.has(32n)) return;
  if (msg.guild.id !== '366219406776336385') return;
  if (msg.channelId === '801804774759727134') return;

  const inviteCheck = () => {
    if (!msg.content.toLocaleLowerCase().includes('discord.gg/')) return;
    msg.delete().catch(() => null);

    client.ch
      .send(
        msg.channel,
        { content: `${msg.author} **Do not send Discord Links in this Channel**` },
        msg.language,
      )
      .then((m) => {
        if (Array.isArray(m)) return;
        jobs.scheduleJob(new Date(Date.now() + 10000), () => {
          if (m) m.delete().catch(() => null);
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
      msg.member.roles.cache.has('369619820867747844') ||
      msg.member.roles.cache.has('367781331683508224') ||
      msg.member.roles.cache.has('585576789376630827') ||
      msg.channelId === '367403201646952450' ||
      msg.channelId === '77766025920027037'
    ) {
      return;
    }

    msg.delete().catch(() => null);

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
          if (m) m.delete().catch(() => null);
        });
      });
  };

  inviteCheck();
  linkCheck();
};

const amMessageCheck = (msg: CT.GuildMessage) => {
  if (!msg.content.includes(' is now level ') || !msg.content.includes(' leveled up!')) return;
  if (Number(msg.content?.split(/ +/)[4].replace(/!/g, '')) > 39) return;

  const levelUp = () => {
    if (msg.author.id !== '159985870458322944' && msg.author.id !== '172002275412279296') {
      return;
    }

    jobs.scheduleJob(new Date(Date.now() + 10000), () => {
      msg.delete().catch(() => null);
    });
  };

  const linkCheck = () => {
    if (msg.channelId !== '298954459172700181') return;
    if (
      !msg.content.toLocaleLowerCase().includes('http://') &&
      !msg.content.toLocaleLowerCase().includes('https://')
    ) {
      return;
    }

    if (msg.member.roles.cache.has('334832484581769217')) return;
    if (msg.member.roles.cache.has('606164114691194900')) return;

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
          if (m) m.delete().catch(() => null);
        });
      });
  };

  levelUp();
  linkCheck();
};

import Discord from 'discord.js';
import jobs from 'node-schedule';
import type CT from '../../../Typings/CustomTypings';
import { ch, client } from '../../../BaseClient/Client.js';

export default async (msg: CT.GuildMessage) => {
  if (msg.author.discriminator === '0000') return;

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

  const pin = () => {
    if (msg.channel.id !== '1060213963205394552') return;
    setTimeout(() => {
      if (!msg.pinned) msg.delete().catch(() => null);
    }, 5000);
  };
  pin();
};

const gvMessageCheck = (msg: CT.GuildMessage) => {
  if (!msg.member) return;
  if (!new Discord.PermissionsBitField(msg.member.permissions)?.has(32n)) return;
  if (msg.guild.id !== '366219406776336385') return;
  if (msg.channelId === '801804774759727134') return;

  const inviteCheck = () => {
    if (!msg.content.toLocaleLowerCase().includes('discord.gg/')) return;
    msg.delete().catch(() => null);

    ch.send(msg.channel, {
      content: `${msg.author} **Do not send Discord Links in this Channel**`,
    }).then((m) => {
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

    ch.send(msg.channel, {
      content: `${msg.author} You are not allowed to post links yet. \`Needed level: Donut [40]\`\n Please use <#298954962699026432> and <#348601610244587531> instead.`,
    }).then((m) => {
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
  const staffPing = async () => {
    if (!msg.content.includes('<@&809261905855643668>')) return;
    await msg.guild.members.fetch();

    msg.channel.send({
      content: msg.guild.roles.cache
        .get('809261905855643668')
        ?.members.map((m) => `<@${m.id}>`)
        .join(', '),
      allowedMentions: {
        users: msg.guild.roles.cache.get('809261905855643668')?.members.map((m) => m.id),
      },
    });
  };
  staffPing();

  const intros = async () => {
    if (msg.channel.id !== '763132467041140737') return;
    if (msg.author.bot) return;

    const messages = await msg.channel.messages.fetch({ limit: 100 });
    const messagesFromSameAuthor = (messages as Discord.Collection<string, Discord.Message>).filter(
      (m) => m.author.id === msg.author.id,
    );

    if (messagesFromSameAuthor.size > 1) {
      const reply = await msg.reply({
        content:
          '__We appreciate your enthusiasm, but you have already sent an introduction!__\nIf you want to refresh your intro, please wait a little longer before posting again\nYou have 20 Seconds before your intro is deleted. **Copy and Save it for later.**',
        allowedMentions: {
          repliedUser: true,
        },
      });

      setTimeout(() => {
        msg.delete();
        reply.delete();
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

    msg.delete();

    ch.send(msg.channel, {
      content: `${msg.author} You are not allowed to post links yet. \`Needed level: Cookie [20]\`\n Please use <#298954962699026432> and <#348601610244587531> instead.`,
    }).then((m) => {
      if (Array.isArray(m)) return;
      jobs.scheduleJob(new Date(Date.now() + 10000), () => {
        if (m) m.delete().catch(() => null);
      });
    });
  };

  levelUp();
  linkCheck();
};

import urlCheck from 'valid-url';
import request from 'request';
import fs from 'fs';
import jobs from 'node-schedule';
import { Worker as WorkerThread } from 'worker_threads';
import type * as Discord from 'discord.js';

import blocklists from '../../../BaseClient/Other/Blocklist.json' assert { type: 'json' };
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import { ch, client } from '../../../BaseClient/Client.js';

interface LinkObject {
  href: string;
  url: string;
  hostname: string;
  baseURL: string;
  baseURLhostname: string;
  contentType: string;
}

export default async (msg: CT.Message) => {
  if (!msg.content || msg.author.id === client.user?.id) {
    return;
  }

  if (!msg.guild) {
    await prepare(msg, { lan: msg.language.antivirus, language: msg.language }, true);
    return;
  }

  const antivirusRow = await ch
    .query('SELECT * FROM antivirus WHERE guildid = $1 AND active = true;', [String(msg.guild.id)])
    .then((r: DBT.antivirus[] | null) => (r ? r[0] : null));

  if (!antivirusRow) return;
  await prepare(msg, { lan: msg.language.antivirus, language: msg.language }, false, antivirusRow);
};

const prepare = async (
  msg: CT.Message,
  { lan }: { lan: CT.Language['antivirus']; language: CT.Language },
  check: boolean,
  res?: DBT.antivirus,
) => {
  const { content } = msg;
  const args = content
    .replace(/\n/g, ' ')
    .replace(/https:\/\//g, ' https://')
    .replace(/http:\/\//, ' http://')
    .split(/ +/);

  const links: string[] = [];

  args.forEach((arg) => {
    let url;
    try {
      url = new URL(arg).hostname;
    } catch {
      // empty block statement
    }

    if (
      urlCheck.isUri(arg) &&
      arg.toLowerCase() !== 'http://' &&
      arg.toLowerCase() !== 'https://' &&
      url
    ) {
      links.push(arg);
    }
  });
  const blocklist = getBlocklist();
  const whitelist = getWhitelist();
  const blacklist = getBlacklist();
  const badLinks = getBadLinks();
  const whitelistCDN = getWhitelistCDN();

  const fullLinks = await makeFullLinks(links);

  let includedBadLink = false;
  let exited = false;

  if (links.length && check) await msg.react(ch.stringEmotes.loading).catch(() => null);

  fullLinks.forEach((linkObject: LinkObject, i) => {
    const AVworker = new WorkerThread(
      `${process.cwd()}/dist/Events/messageEvents/messageCreate/antivirusWorker.js`,
    );

    AVworker.on('exit', () => {
      exited = true;
    });

    AVworker.on('message', async (data) => {
      data.msg = msg;
      data.language = msg.language;

      if (!data.check && data.type !== 'send') {
        includedBadLink = true;
      }

      if (includedBadLink || i === fullLinks.length - 1) {
        if (client.user) {
          msg.reactions.cache
            .get(ch.objectEmotes.loading.id)
            ?.users.remove(client.user.id)
            .catch(() => null);
        }
        AVworker.terminate();
      }

      switch (data.type) {
        case 'doesntExist': {
          doesntExist(data, res);
          break;
        }
        case 'blacklisted': {
          blacklisted(data, res);
          break;
        }
        case 'whitelisted': {
          whitelisted(data, res);
          break;
        }
        case 'newUrl': {
          newUrl(data, res);
          break;
        }
        case 'severeLink': {
          severeLink(data, res);
          break;
        }
        case 'ccscam': {
          ccscam(data, res);
          break;
        }
        case 'cloudFlare': {
          cloudFlare(data, res);
          break;
        }
        case 'send': {
          ch.send({ id: data.channelid, guildId: '669893888856817665' }, { content: data.content });
          break;
        }
        case 'VTfail': {
          VTfail(data, res);
          break;
        }
        default:
          break;
      }
    });

    AVworker.on('error', (error) => {
      throw error;
    });

    AVworker.postMessage({
      msgData: {
        channelid: msg.channelId,
        msgid: msg.id,
        guildid: msg.guild?.id ?? '@me',
      },
      linkObject,
      lan,
      includedBadLink,
      check,
      blacklist,
      whitelist,
      whitelistCDN,
      blocklist,
      badLinks,
    });

    jobs.scheduleJob(new Date(Date.now() + 180000), () => {
      if (!exited) {
        AVworker.terminate();
      }
    });
  });
};

const getBlocklist = () => {
  const blacklist: string[] = [...new Set(blocklists)];
  blacklist.forEach((entry, index) => {
    entry = entry.replace(/#{2}-{1}/g, '');

    if (entry.startsWith('#')) {
      blacklist.splice(index, 1);
    }
  });
  return blacklist;
};

const getWhitelist = () => {
  const file = fs.readFileSync('/root/Bots/Website/CDN/antivirus/whitelisted.txt', {
    encoding: 'utf8',
  });
  const whitelistRes = file ? file.split(/\n+/) : [];

  return whitelistRes.map((entry) => entry.replace(/\r/g, ''));
};

const getBlacklist = () => {
  const file = fs.readFileSync('/root/Bots/Website/CDN/antivirus/blacklisted.txt', {
    encoding: 'utf8',
  });
  const blacklistRes = file ? file.split(/\n+/) : [];

  return blacklistRes.map((entry) => entry.replace(/\r/g, ''));
};

const getBadLinks = () => {
  const file = fs.readFileSync('/root/Bots/Website/CDN/antivirus/badLinks.txt', {
    encoding: 'utf8',
  });
  const badLinks = file ? file.split(/\n+/).filter((line) => !line.startsWith('//')) : [];

  return badLinks.map((entry) => entry.replace(/\r/g, '').replace(/https:\/\//g, ''));
};

const getWhitelistCDN = () => {
  const file = fs.readFileSync('/root/Bots/Website/CDN/antivirus/whitelistedCDN.txt', {
    encoding: 'utf8',
  });
  const whitelistCDNRes = file ? file.split(/\n+/) : [];

  return whitelistCDNRes.map((entry) => entry.replace(/\r/g, ''));
};

const makeFullLinks = async (links: string[]) => {
  const fullLinks: LinkObject[] = [];

  const makeAndPushLinkObj = async (link: string) => {
    const url = new URL(link);
    const response = await new Promise((resolve) => {
      request(link, { method: 'HEAD', followAllRedirects: true }, (_error, res) => {
        if (res) {
          resolve([res?.request?.href, res?.headers ? res.headers['content-type'] : null]);
        } else {
          resolve([link, null]);
        }
      });
    });

    const [href, contentType] = response as [string, string];

    const object = {
      contentType,
      href,
      url: `${href || (url.href ? url.href : `${url.protocol}//${url.hostname}`)}`,
      hostname: url.hostname,
      baseURL: '',
      baseURLhostname: '',
    };

    fullLinks.push(object);
  };

  const promises = links.map((link) => makeAndPushLinkObj(link));

  await Promise.all(promises);

  return fullLinks.map((linkObject) => {
    const urlParts = new URL(linkObject.url).hostname.split('.');
    const slicedURL = urlParts
      .slice(0)
      .slice(-(urlParts.length === 4 ? 3 : 2))
      .join('.');
    const newLink = `${new URL(linkObject.url).protocol}//${slicedURL}`;

    return {
      ...linkObject,
      baseURL: newLink,
      baseURLhostname: new URL(newLink).hostname,
    };
  });
};

const doesntExist = async (
  {
    msg,
    lan,
    linkObject,
    check,
  }: { msg: CT.Message; lan: CT.Language['antivirus']; linkObject: LinkObject; check: boolean },
  res?: DBT.antivirus,
) => {
  const embed: Discord.APIEmbed = {
    description: `**${msg.language.Result}**\n${lan.notexistent(linkObject.baseURLhostname)}`,
    color: ch.constants.colors.success,
  };

  embed.fields = [];
  if (check) embed.fields.push({ name: lan.checking, value: linkObject.href });

  ch.replyMsg(msg, { embeds: [embed] });

  linkLog(
    msg,
    lan,
    ch.constants.colors.success,
    linkObject,
    lan.notexistent(linkObject.baseURLhostname),
    res,
  );
};

const blacklisted = async (
  {
    msg,
    lan,
    linkObject,
    check,
    note,
  }: {
    msg: CT.Message;
    lan: CT.Language['antivirus'];
    linkObject: LinkObject;
    check: boolean;
    note: string | boolean;
  },
  res?: DBT.antivirus,
) => {
  if (note && typeof note === 'string') {
    const embed: Discord.APIEmbed = {
      description: `**${msg.language.Result}**\n${lan.malicious(ch.stringEmotes.cross)}`,
      color: ch.constants.colors.danger,
      fields: [{ name: msg.language.attention, value: note.split(/\|+/)[1] }],
    };

    if (check) embed.fields?.push({ name: lan.checking, value: linkObject.href });

    await ch.replyMsg(msg, { embeds: [embed] });
  } else {
    const embed: Discord.APIEmbed = {
      description: `**${msg.language.Result}**\n${lan.malicious(ch.stringEmotes.cross)}`,
      color: ch.constants.colors.danger,
    };

    embed.fields = [];
    if (check) embed.fields.push({ name: lan.checking, value: linkObject.href });

    const m = await ch.replyMsg(msg, { embeds: [embed] });

    ch.send(
      { id: '726252103302905907', guildId: '669893888856817665' },
      {
        content: ch.getJumpLink(msg),
      },
    );

    if (msg.guild) {
      (await import('../../antivirusHandler.js')).default(msg as CT.GuildMessage, m ?? undefined);
    }
  }

  linkLog(
    msg,
    lan,
    ch.constants.colors.danger,
    linkObject,
    lan.malicious(ch.stringEmotes.cross),
    res,
  );
};

const severeLink = async (
  {
    msg,
    lan,
    linkObject,
    check,
    hrefLogging,
  }: {
    msg: CT.Message;
    lan: CT.Language['antivirus'];
    linkObject: LinkObject;
    check: boolean;
    hrefLogging: boolean;
  },
  res?: DBT.antivirus,
) => {
  saveToBadLink(linkObject, hrefLogging);

  const embed: Discord.APIEmbed = {
    description: `**${msg.language.Result}**\n${lan.malicious(ch.stringEmotes.cross)}`,
    color: ch.constants.colors.danger,
  };
  embed.fields = [];

  if (check) embed.fields.push({ name: lan.checking, value: linkObject.href });

  const m = await ch.replyMsg(msg, { embeds: [embed] });

  ch.send(
    { id: '726252103302905907', guildId: '669893888856817665' },
    {
      content: ch.getJumpLink(msg),
    },
  );
  if (msg.guild) {
    (await import('../../antivirusHandler.js')).default(msg as CT.GuildMessage, m ?? undefined);
  }
  linkLog(
    msg,
    lan,
    ch.constants.colors.danger,
    linkObject,
    lan.malicious(ch.stringEmotes.cross),
    res,
  );
};

const ccscam = async (
  {
    msg,
    lan,
    linkObject,
    check,
  }: { msg: CT.Message; lan: CT.Language['antivirus']; linkObject: LinkObject; check: boolean },
  res?: DBT.antivirus,
) => {
  saveToBadLink(linkObject);
  const embed: Discord.APIEmbed = {
    description: `**${msg.language.Result}**\n${lan.malicious(ch.stringEmotes.cross)}`,
    color: ch.constants.colors.danger,
  };

  embed.fields = [];
  if (check) embed.fields.push({ name: lan.checking, value: linkObject.href });

  const m = await ch.replyMsg(msg, { embeds: [embed] });

  ch.send(
    { id: '726252103302905907', guildId: '669893888856817665' },
    {
      content: ch.getJumpLink(msg),
    },
  );
  if (msg.guild) {
    (await import('../../antivirusHandler.js')).default(msg as CT.GuildMessage, m ?? undefined);
  }

  linkLog(
    msg,
    lan,
    ch.constants.colors.danger,
    linkObject,
    lan.malicious(ch.stringEmotes.cross),
    res,
  );
};

const newUrl = async (
  {
    msg,
    lan,
    linkObject,
    check,
  }: { msg: CT.Message; lan: CT.Language['antivirus']; linkObject: LinkObject; check: boolean },
  res?: DBT.antivirus,
) => {
  saveToBadLink(linkObject);

  const embed: Discord.APIEmbed = {
    description: `**${msg.language.Result}**\n${lan.newLink(ch.stringEmotes.cross)}`,
    color: ch.constants.colors.danger,
  };

  embed.fields = [];
  if (check) embed.fields.push({ name: lan.checking, value: linkObject.href });

  const m = await ch.replyMsg(msg, { embeds: [embed] });

  ch.send(
    { id: '726252103302905907', guildId: '669893888856817665' },
    {
      content: ch.getJumpLink(msg),
    },
  );

  if (msg.guild) {
    (await import('../../antivirusHandler.js')).default(msg as CT.GuildMessage, m ?? undefined);
  }
  linkLog(
    msg,
    lan,
    ch.constants.colors.danger,
    linkObject,
    lan.newLink(ch.stringEmotes.cross),
    res,
  );
};

const saveToBadLink = async (linkObject: LinkObject, hrefLogging?: boolean) => {
  const file = fs.readFileSync('/root/Bots/Website/CDN/antivirus/badLinks.txt', {
    encoding: 'utf8',
  });
  const res = file ? file.split(/\n+/).map((entry) => entry.replace(/\r/g, '')) : [];
  const channel = await ch.getChannel.guildTextChannel('726252103302905907');
  if (!channel) return;

  if (!res.includes(linkObject.baseURL)) {
    ch.send(channel, {
      content: `contentType: ${linkObject.contentType}\nhref: ${linkObject.href}\nurl: ${linkObject.url}\nhostname: ${linkObject.hostname}\nbaseURL: ${linkObject.baseURL}\nbaseURLhostname: ${linkObject.baseURLhostname}\n`,
    });
  }

  const appended = hrefLogging ? linkObject.href : linkObject.baseURL;
  fs.appendFile('/root/Bots/Website/CDN/antivirus/badLinks.txt', `\n${appended}`, () => null);
};

const whitelisted = async (
  {
    msg,
    lan,
    linkObject,
    check,
  }: { msg: CT.Message; lan: CT.Language['antivirus']; linkObject: LinkObject; check: boolean },
  res?: DBT.antivirus,
) => {
  const embed: Discord.APIEmbed = {
    description: `**${msg.language.Result}**\n${lan.whitelisted(ch.stringEmotes.tick)}`,
    color: ch.constants.colors.success,
  };

  embed.fields = [];
  if (check) {
    embed.fields.push({ name: lan.checking, value: linkObject.href });
    ch.replyMsg(msg, { embeds: [embed] });
  }

  linkLog(
    msg,
    lan,
    ch.constants.colors.success,
    linkObject,
    lan.whitelisted(ch.stringEmotes.tick),
    res,
  );
  return true;
};

const cloudFlare = async (
  {
    msg,
    lan,
    linkObject,
    check,
  }: { msg: CT.Message; lan: CT.Language['antivirus']; linkObject: LinkObject; check: boolean },
  res?: DBT.antivirus,
) => {
  const embed: Discord.APIEmbed = {
    description: `**${msg.language.Result}**\n${lan.cfProtected}`,
    color: 16776960,
  };

  embed.fields = [];
  if (check) embed.fields.push({ name: lan.checking, value: linkObject.href });

  ch.replyMsg(msg, { embeds: [embed] });

  ch.send(
    { id: '726252103302905907', guildId: '669893888856817665' },
    {
      content: `${ch.getJumpLink(msg)}\nis CloudFlare Protected\n${linkObject.href}`,
    },
  );

  linkLog(msg, lan, ch.constants.colors.loading, linkObject, lan.cfProtected, res);
};

const VTfail = (
  {
    msg,
    lan,
    linkObject,
    check,
  }: { msg: CT.Message; lan: CT.Language['antivirus']; linkObject: LinkObject; check: boolean },
  res?: DBT.antivirus,
) => {
  const embed: Discord.APIEmbed = {
    description: `**${msg.language.Result}**\n${lan.VTfail(ch.stringEmotes.cross)}`,
    color: ch.constants.colors.loading,
  };

  embed.fields = [];
  if (check) embed.fields.push({ name: lan.checking, value: linkObject.href });

  ch.replyMsg(msg, { embeds: [embed] });

  linkLog(
    msg,
    lan,
    ch.constants.colors.loading,
    linkObject,
    lan.VTfail(ch.stringEmotes.cross),
    res,
  );
};

const linkLog = async (
  msg: CT.Message,
  lan: CT.Language['antivirus'],
  color: number,
  linkObject: LinkObject,
  text: string,
  row?: DBT.antivirus,
) => {
  if (!row || !row.linklogging || !row.linklogchannels?.length) return;

  const embed: Discord.APIEmbed = {
    description: lan.log.value(msg),
    author: {
      name: lan.log.author,
      url: ch.constants.standard.invite,
    },
    color,
    fields: [
      { name: `\u200b`, value: text, inline: false },
      {
        name: lan.log.href,
        value: ch.util.makeCodeBlock(linkObject.href),
        inline: false,
      },
      {
        name: lan.log.url,
        value: ch.util.makeCodeBlock(String(linkObject.url)),
        inline: false,
      },
      {
        name: lan.log.hostname,
        value: ch.util.makeCodeBlock(String(linkObject.hostname)),
        inline: true,
      },
      {
        name: lan.log.baseURL,
        value: ch.util.makeCodeBlock(String(linkObject.baseURL)),
        inline: false,
      },
      {
        name: lan.log.baseURLhostname,
        value: ch.util.makeCodeBlock(String(linkObject.baseURLhostname)),
        inline: true,
      },
    ],
  };

  if (!msg.guild?.id) return;

  ch.send({ id: row.linklogchannels, guildId: msg.guild.id }, { embeds: [embed] });
};

import Prisma, { PunishmentType } from '@prisma/client';
import * as Discord from 'discord.js';
import * as fs from 'fs';
import Jobs from 'node-schedule';
import client, { API } from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';
import * as VirusVendorsTypings from '../../../../Typings/VirusVendorsTypings.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';

type VendorType = 'Kaspersky' | 'Google Safe Browsing' | 'PromptAPI' | 'VirusTotal';

const highlyCredibleVTVendors = [
 'Yandex Safebrowsing',
 'Google Safebrowsing',
 'Kaspersky',
 'BitDefender',
];

const cleanURL = (s: string) =>
 s.replace('https://', '').replace('http://', '').replace('www.', '').split(/\/+/g)[0];

export default async (msg: Discord.Message) => {
 if (!msg.content) return;
 if (msg.author.bot) return;

 const settings = msg.inGuild()
  ? await client.util.DataBase.antivirus.findUnique({
     where: { guildid: msg.guildId, active: true },
    })
  : undefined;
 if (!settings && msg.inGuild()) return;

 const result = await run(msg.content);
 if (!('url' in result)) return;

 if (!msg.inGuild()) {
  await API.channels.addMessageReaction(
   msg.channelId,
   msg.id,
   client.util.constants.standard.getEmoteIdentifier(client.util.emotes.loading),
  );
 }

 const language = await client.util.getLanguage(msg.guildId);

 if (!msg.inGuild() || result.triggers) {
  log(
   settings?.linklogging && settings?.linklogchannels.length
    ? settings.linklogchannels
    : msg.channel,
   msg,
   language,
   result,
  );
 }

 if (!msg.inGuild()) {
  await API.channels.deleteOwnMessageReaction(
   msg.channelId,
   msg.id,
   client.util.constants.standard.getEmoteIdentifier(client.util.emotes.loading),
  );
 }

 if (!result.triggers) {
  writeAllowlist(result.url);
  return;
 }

 if (msg.inGuild() && settings?.deletemsg) {
  await msg.client.util.request.channels.deleteMessage(msg);
 }

 writeDenylist(result.url);

 if (msg.inGuild() && settings) performPunishment(msg, settings, language, msg);
};

const log = (
 channels: string[] | Discord.Message<false>['channel'],
 msg: Discord.Message,
 language: CT.Language,
 url: CT.DePromisify<ReturnType<typeof run>>,
) => {
 const getFields = () => {
  const lan = language.antivirus.log;

  switch (url.type) {
   case 'VirusTotal': {
    const res = url.result as VirusVendorsTypings.VirusTotalAnalyses;
    const results = res.data.attributes.stats;

    return [
     {
      name: lan.scanResult,
      value: `${lan.vtStats(
       String(results.malicious),
       String(results.suspicious),
       String(results.harmless),
       String(results.undetected),
      )}\n\n[${lan.scanLink}](https://www.virustotal.com/gui/url/${res.data.id.split('-')[1]})`,
     },
    ];
   }
   case 'PromptAPI':
    return [
     {
      name: lan.age,
      value: lan.ageDesc,
     },
    ];
   case 'Kaspersky': {
    const res = url.result as VirusVendorsTypings.Kaspersky;

    return [
     {
      name: lan.scanResult,
      value: lan.detectedAs(
       res.DomainGeneralInfo.Categories.map((c) => client.util.util.makeInlineCode(c)).join(', '),
      ),
     },
    ];
   }
   case 'Google Safe Browsing': {
    const res = url.result as VirusVendorsTypings.GoogleSafeBrowsing;

    return [
     {
      name: lan.scanResult,
      value: lan.detectedAs(
       res.matches.map((m) => client.util.util.makeInlineCode(m.threatType)).join(', '),
      ),
     },
    ];
   }
   default:
    return [];
  }
 };

 const payload: CT.UsualMessagePayload = {
  embeds: [
   {
    color: url.triggers ? CT.Colors.Danger : CT.Colors.Success,
    author: {
     name: language.autotypes.antivirus,
     icon_url: client.util.constants.events.logs.invite.create,
    },
    description: `${language.antivirus.log.value(msg)}\n\n${language.antivirus.log.name}\n${url.urls
     .map((u) => client.util.util.makeInlineCode(u))
     .join(', ')}`,
    fields: [
     ...(url.url
      ? [
         { name: '\u200b', value: '\u200b' },
         {
          name: language.antivirus.malicious(
           client.util.constants.standard.getEmote(client.util.emotes.crossWithBackground),
          ),
          value: client.util.util.makeInlineCode(url.url),
         },
         { name: '\u200b', value: '\u200b' },
        ]
      : []),
     ...getFields(),
    ],
   },
  ],
 };

 if (msg.inGuild()) {
  client.util.send({ id: channels as string[], guildId: msg.guildId }, payload, 10000);
 } else {
  client.util.send(channels as Discord.TextBasedChannel, payload);
 }
};

const run = async (content: string) => {
 const urls = await getURLs(content);
 if (!urls.length) return { triggers: false, urls };

 let resolved = false;

 const triggersAV:
  | undefined
  | {
     triggers: boolean;
     url: string;
     result?:
      | VirusVendorsTypings.Kaspersky
      | VirusVendorsTypings.GoogleSafeBrowsing
      | VirusVendorsTypings.PromptAPI
      | VirusVendorsTypings.VirusTotalAnalyses;
     type?: VendorType;
     // eslint-disable-next-line no-async-promise-executor
    } = await new Promise(async (res) => {
  for (let i = 0; i < urls.length; i += 1) {
   if (resolved) continue;

   // eslint-disable-next-line no-await-in-loop
   const result = await getTriggersAV(urls[i]);
   if (!result.triggers) continue;

   resolved = true;
   res({ triggers: true, url: urls[i], result: result.result, type: result.type });
  }

  if (!resolved) res(undefined);
 });

 if (!triggersAV?.triggers) return { triggers: false, urls, url: triggersAV?.url };

 reportFishFish(triggersAV.url);

 return {
  triggers: true,
  urls,
  url: triggersAV.url,
  result: triggersAV.result,
  type: triggersAV.type,
 };
};

const getURLs = async (content: string): Promise<string[]> => {
 if (!content.match(client.util.regexes.urlTester(client.util.cache.urlTLDs.toArray()))) return [];

 const args = content
  .split(/(\s+|\n+)/g)
  .map((url) => url.trim())
  .map((url) =>
   /\[.*\](.*\s?.*)/g.test(url)
    ? url.replace(/\[|\]|\(|\)/g, '').split(/https:\/\/|http:\/\//g)
    : url,
  )
  .flat();
 const argsContainingLink = args
  .filter((a) => a.includes('.'))
  .filter((arg) => arg.match(client.util.regexes.urlTester(client.util.cache.urlTLDs.toArray())));

 return (await Promise.all(argsContainingLink.map((arg) => client.util.fetchWithRedirects(arg))))
  .flat()
  .filter((u) => u.match(client.util.regexes.urlTester(client.util.cache.urlTLDs.toArray())));
};

const getTriggersAV = async (
 url: string,
): Promise<{
 url: string;
 type?: VendorType;
 result?:
  | VirusVendorsTypings.Kaspersky
  | VirusVendorsTypings.GoogleSafeBrowsing
  | VirusVendorsTypings.PromptAPI
  | VirusVendorsTypings.VirusTotalAnalyses;
 triggers: boolean;
}> => {
 const websiteResponse = await checkIfExists(url);
 if (!websiteResponse) return { url, triggers: false };

 if (inAllowlist(url)) return { url, triggers: false };
 if (inDenylist(url)) return { url, triggers: true };
 if (inFishFish(url)) return { url, triggers: true };
 if (inSinkingYachts(url)) return { url, triggers: true };
 if (await inSpamHaus(url)) return { url, triggers: true };

 const kaspersky = await inKaspersky(url);
 if (kaspersky.triggered) {
  return { url, type: 'Kaspersky', result: kaspersky.result, triggers: true };
 }

 const googleSafeBrowsing = await inGoogleSafeBrowsing(url);
 if (googleSafeBrowsing.triggers) {
  return { url, type: 'Google Safe Browsing', result: googleSafeBrowsing.result, triggers: true };
 }

 const promptAPI = await ageCheck(url);
 if (promptAPI.triggers) {
  return { url, triggers: true, result: promptAPI.result, type: 'PromptAPI' };
 }

 const virusTotal = await inVT(url);
 if (virusTotal.triggers && virusTotal.result !== false && typeof virusTotal.result !== 'string') {
  return { url, triggers: true, result: virusTotal.result, type: 'VirusTotal' };
 }

 return { triggers: false, url };
};

const checkIfExists = async (url: string) => {
 try {
  const get = await fetch(url.startsWith('http') ? url : `http://${url}`, { method: 'GET' });
  const text = await get.text();
  return !!text;
 } catch {
  return false;
 }
};

// https://phish.sinking.yachts/
const inSinkingYachts = (u: string) => client.util.cache.sinkingYachts.cache.has(cleanURL(u));

const inSpamHaus = async (u: string) => {
 const res = await fetch(`https://apibl.spamhaus.net/lookup/v1/dbl/${cleanURL(u)}`, {
  headers: {
   Authorization: `Bearer ${process.env.spamhausToken}`,
   'Content-Type': 'application/json',
  },
 }).catch((r: Error) => {
  console.error('Failed to query Spamhaus for', cleanURL(u));
  return r;
 });

 return 'status' in res && res.status === 200;
};

const ageCheck = async (u: string) => {
 const res = await fetch(`https://api.promptapi.com/whois/query?domain=${cleanURL(u)}`, {
  headers: { apikey: process.env.promptAPIToken ?? '' },
 }).catch((r: Error) => r);

 if (!('ok' in res) || !res.ok) return { triggers: false };

 const json = (await res.json()) as VirusVendorsTypings.PromptAPI;
 if (json.result === 'not found') return { triggers: false, type: 'PromptAPI' };

 const ageInDays = Math.ceil(
  Math.abs(new Date(json.result.creation_date).getTime() + new Date().getTime()) /
   (1000 * 3600 * 24),
 );

 return { triggers: ageInDays < 8, type: 'PromptAPI', result: json };
};

const inVT = async (u: string) => {
 const body = new FormData();
 body.set('url', u);

 const res = await fetch('https://www.virustotal.com/api/v3/urls', {
  method: 'POST',
  headers: { 'x-apikey': process.env.VTToken ?? '' },
  body,
 }).catch((r: Error) => r);

 if (!('ok' in res) || !res.ok) return { triggers: false };

 const urlsData = (await res.json()) as VirusVendorsTypings.VirusTotalURLs;
 const analysesData = await getAnalyses(urlsData.data.id);
 if (typeof analysesData === 'string') return { triggers: false };

 return getSeverity(analysesData)
  ? { triggers: true, result: analysesData, type: 'VirusTotal' }
  : { triggers: false };
};

const getAnalyses = async (
 id: string,
 i = 1,
): Promise<false | string | VirusVendorsTypings.VirusTotalAnalyses> => {
 if (i > 5) throw new Error('Too many requests');

 return new Promise((resolve) => {
  Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000 * i), async () => {
   const res = await fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
    headers: {
     'x-apikey': process.env.VTToken ?? '',
    },
   }).catch((r: Error) => r);

   if (!('ok' in res)) return resolve(await getAnalyses(id, i + 1));
   if (!res.ok) return resolve((await res.text()) as string);

   const data = (await res.json()) as VirusVendorsTypings.VirusTotalAnalyses;
   if (typeof data === 'string') return resolve(false);

   if (data.data.attributes.status === 'completed') return resolve(data);
   return resolve(await getAnalyses(id, i + 1));
  });
 });
};

const getSeverity = (result: VirusVendorsTypings.VirusTotalAnalyses | false) => {
 if (!result) return false;

 if (
  Object.entries(result.data.attributes.results).find(
   ([, v]) =>
    ['malicious', 'suspicious'].includes(v.category) &&
    highlyCredibleVTVendors.includes(v.engine_name),
  )
 ) {
  return true;
 }

 return result.data.attributes.stats.malicious + result.data.attributes.stats.suspicious > 5;
};

const inGoogleSafeBrowsing = async (u: string) => {
 const res = await fetch(
  `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${
   process.env.safeBrowsingToken ?? ''
  }`,
  {
   method: 'POST',
   body: JSON.stringify({
    client: {
     clientId: 'Ayako Development',
     clientVersion: client.util.files.importCache.package.file.version,
    },
    threatInfo: {
     threatTypes: [
      'MALWARE',
      'SOCIAL_ENGINEERING',
      'UNWANTED_SOFTWARE',
      'POTENTIALLY_HARMFUL_APPLICATION',
     ],
     platformTypes: ['ALL_PLATFORMS'],
     threatEntryTypes: ['URL'],
     threatEntries: [
      {
       url: u,
      },
     ],
    },
   }),
  },
 ).catch((e: Error) => e);

 if (!('ok' in res) || !res.ok) return { triggers: false, type: 'Google Safe Browsing' };

 const json = (await res.json()) as VirusVendorsTypings.GoogleSafeBrowsing;
 if (json.matches?.length) {
  return { triggers: true, type: 'Google Safe Browsing', result: json };
 }

 return { triggers: false, type: 'Google Safe Browsing' };
};

const reportFishFish = (u: string) => {
 if (client.util.cache.reportedURLs.has(u)) return;
 client.util.cache.reportedURLs.add(u);

 fetch('https://yuri.bots.lostluma.dev/phish/report', {
  method: 'POST',
  headers: {
   authorization: process.env.phishToken ?? '',
  },
  body: JSON.stringify({
   url: u,
   reason:
    'Reported by at least one of the following Vendors: Google Safe Browsing, SpamHaus, VirusTotal, Sinking Yachts, PromptAPI, FishFish',
  }),
 }).catch(() => {});
};

const inAllowlist = (url: string) =>
 (
  fs
   .readFileSync(client.util.constants.path.allowlist, {
    encoding: 'utf8',
   })
   ?.split(/\n+/g)
   .map((r) => r.replace(/\r+/g, '')) ?? []
 ).includes(cleanURL(new URL(url).origin).replace('https://', ''));

const inDenylist = (url: string) =>
 (
  fs
   .readFileSync(client.util.constants.path.badLinks, {
    encoding: 'utf8',
   })
   ?.split(/\n+/g)
   .map((r) => r.replace(/\r+/g, '')) ?? []
 ).includes(cleanURL(new URL(url).origin).replace('https://', ''));

const writeAllowlist = (url: string | undefined) => {
 if (!url) return;
 fs.appendFileSync(client.util.constants.path.allowlist, `\n${new URL(url).origin}`);
};

const writeDenylist = (url: string | undefined) => {
 if (!url) return;
 fs.appendFileSync(client.util.constants.path.badLinks, `\n${new URL(url).origin}`);
};

// https://api.fishfish.gg/v1/docs
const inFishFish = (u: string) => client.util.cache.fishFish.cache.has(cleanURL(u));

const inKaspersky = async (u: string) => {
 const res = await fetch(
  `https://opentip.kaspersky.com/api/v1/search/domain?request=${cleanURL(u)}`,
  {
   headers: {
    'x-api-key': process.env.kasperskyToken ?? '',
   },
  },
 ).catch((e: Error) => e);

 if (!('ok' in res) || !res.ok) return { triggered: false };

 const json = (await res.json()) as VirusVendorsTypings.Kaspersky;
 if (json.Zone === 'Red') return { triggered: true, type: 'Kaspersky', result: json };

 return { triggered: false, type: 'Kaspersky', result: json };
};

export const performPunishment = async (
 rawMessage: Discord.Message<true> | undefined,
 settings: Prisma.antivirus | Prisma.antispam,
 language: CT.Language,
 additionalData: Discord.Message<true>,
) => {
 const msg = rawMessage ?? additionalData;

 const baseOptions = {
  dbOnly: false,
  reason: language.autotypes.antivirus,
  executor: (await msg.client.util.getBotMemberFromGuild(msg.guild)).user,
  target: msg.author,
  guild: msg.guild,
  skipChecks: false,
 };

 switch (settings.action) {
  case PunishmentType.ban:
   return client.util.mod(msg, CT.ModTypes.BanAdd, {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deletemessageseconds),
   });
  case PunishmentType.channelban:
   return client.util.mod(msg, CT.ModTypes.ChannelBanAdd, {
    ...baseOptions,
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
  case PunishmentType.kick:
   return client.util.mod(msg, CT.ModTypes.KickAdd, baseOptions);
  case PunishmentType.softban:
   return client.util.mod(msg, CT.ModTypes.SoftBanAdd, {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deletemessageseconds),
   });
  case PunishmentType.strike:
   return client.util.mod(msg, CT.ModTypes.StrikeAdd, baseOptions);
  case PunishmentType.warn:
   return client.util.mod(msg, CT.ModTypes.WarnAdd, baseOptions);
  case PunishmentType.tempban:
   return client.util.mod(msg, CT.ModTypes.TempBanAdd, {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deletemessageseconds),
    duration: Number(settings.duration),
   });
  case PunishmentType.tempchannelban:
   return client.util.mod(msg, CT.ModTypes.TempChannelBanAdd, {
    ...baseOptions,
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
    duration: Number(settings.duration),
   });
  case PunishmentType.tempmute:
   return client.util.mod(msg, CT.ModTypes.TempMuteAdd, {
    ...baseOptions,
    duration: Number(settings.duration),
   });
  default:
   throw new Error(`Invalid action: ${settings.action}`);
 }
};

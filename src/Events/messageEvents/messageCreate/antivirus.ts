import * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import fetch from 'node-fetch';
import Prisma from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import auth from '../../../auth.json' assert { type: 'json' };
import CT, { DePromisify } from '../../../Typings/CustomTypings.js';
import pack from '../../../../package.json' assert { type: 'json' };

const cleanURL = (s: string) =>
 s.replace('https://', '').replace('http://', '').replace('www.', '').split(/\/+/g)[0];

export default async (msg: Discord.Message<true>) => {
 if (!msg.content) return;
 if (msg.author.bot) return;
 if (msg.author.id !== '564052925828038658') return;

 const settings = await ch.DataBase.antivirus.findUnique({
  where: { guildid: msg.guildId, active: true },
 });
 if (!settings) return;

 const url = await run(msg.content);
 const language = await ch.getLanguage(msg.guildId);

 if (settings.linklogging && settings.linklogchannels.length) {
  ch.send(
   { id: settings.linklogchannels, guildId: msg.guildId },
   {
    embeds: [
     {
      color: url.triggers ? ch.constants.colors.danger : ch.constants.colors.success,
      author: {
       name: language.deleteReasons.antivirus,
       icon_url: ch.constants.events.logs.invite.create,
      },
      description: language.antivirus.log.value(msg),
      fields: [
       {
        name: language.antivirus.log.name,
        value: url.urls.map((u) => ch.util.makeInlineCode(u)).join('\n'),
       },
       ...(url.url
        ? [
           {
            name: language.antivirus.malicious(
             ch.constants.standard.getEmote(ch.emotes.crossWithBackground),
            ),
            value: ch.util.makeInlineCode(url.url),
           },
          ]
        : []),
      ],
     },
    ],
   },
  );
 }

 if (!url.triggers) return;
 performPunishment(msg, settings, language);
};

const run = async (content: string) => {
 const urls = await getURLs(content);

 let resolved = false;
 // eslint-disable-next-line no-async-promise-executor
 const triggersAV: string | false = await new Promise(async (res) => {
  for (let i = 0; i < urls.length; i += 1) {
   if (resolved) return;

   // eslint-disable-next-line no-await-in-loop
   const result = await getTriggersAV(urls[i]);
   if (!result) return;

   resolved = true;
   res(result);
  }

  if (!resolved) res(false);
 });

 if (!triggersAV) return { triggers: false, urls, url: triggersAV };

 reportFishFish(triggersAV);

 return { triggers: true, urls, url: triggersAV };
};

const getURLs = async (content: string): Promise<string[]> => {
 if (!content.match(ch.regexes.urlTester(ch.cache.urlTLDs.toArray()))) return [];

 const args = content.split(/(\s+|\n+)/g);
 const argsContainingLink = args
  .filter((a) => a.includes('.'))
  .filter((arg) => arg.match(ch.regexes.urlTester(ch.cache.urlTLDs.toArray())));

 return (await Promise.all(argsContainingLink.map((arg) => ch.fetchWithRedirects(arg)))).flat();
};

const getTriggersAV = async (url: string) => {
 const websiteResponse = await checkIfExists(url);
 if (!websiteResponse) return false;

 if (await inFishFish(url)) return url;
 if (inSinkingYachts(url)) return url;
 if (await inSpamHaus(url)) return url;
 if (await inGoogleSafeBrowsing(url)) return url;
 if (await ageCheck(url)) return url;
 if (await inVT(url)) return url;

 return false;
};

const checkIfExists = async (url: string) =>
 (await fetch(url.startsWith('http') ? url : `http://${url}`, { method: 'HEAD' })).ok;

// https://phish.sinking.yachts/
const inSinkingYachts = (u: string) => ch.cache.sinkingYachts.cache.has(cleanURL(u));

const inSpamHaus = async (u: string) => {
 const res = await fetch(`https://apibl.spamhaus.net/lookup/v1/dbl/${cleanURL(u)}`, {
  headers: {
   Authorization: `Bearer ${auth.spamhausToken}`,
   'Content-Type': 'application/json',
  },
 });

 return res.status === 200;
};

const ageCheck = async (u: string) => {
 const res = await fetch(`https://api.promptapi.com/whois/query?domain=${cleanURL(u)}`, {
  headers: { apikey: auth.promptAPIToken },
 });

 if (!res.ok) return false;

 const data = (await res.json()) as { result: { creation_date: string } };
 const ageInDays = Math.ceil(
  Math.abs(new Date(data.result.creation_date).getTime() + new Date().getTime()) /
   (1000 * 3600 * 24),
 );

 return ageInDays < 8;
};

const inVT = async (u: string) => {
 const body = new FormData();
 body.set('url', u);

 const urlsRes = await fetch('https://www.virustotal.com/api/v3/urls', {
  method: 'POST',
  headers: {
   'x-apikey': auth.VTtoken,
  },
  body,
 });

 if (!urlsRes.ok) return false;

 const urlsData = (await urlsRes.json()) as { data: { id: string; type: 'analyses' } };
 const analysesData = await getAnalyses(urlsData.data.id);
 if (typeof analysesData === 'string') return false;

 return getSeverity(analysesData.data.attributes.stats) ? u : false;
};

const getAnalyses = async (
 id: string,
 i = 1,
): Promise<
 | {
    data: {
     attributes: {
      status: 'queued' | 'completed' | 'in-progress';
      stats: CT.Argument<typeof getSeverity, 0>;
     };
     id: string;
    };
   }
 | string
> => {
 if (i > 5) throw new Error('Too many requests');

 return new Promise((resolve) => {
  Jobs.scheduleJob(new Date(Date.now() + 5000 * i), async () => {
   const res = await fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
    headers: {
     'x-apikey': auth.VTtoken,
    },
   });
   if (!res.ok) return resolve((await res.text()) as string);

   const data = (await res.json()) as DePromisify<ReturnType<typeof getAnalyses>>;

   if (typeof data === 'string') return false;
   if (data.data.attributes.status === 'completed') return resolve(data);
   return resolve(await getAnalyses(id, i + 1));
  });
 });
};

const getSeverity = (VTresponse: { suspicious: number; malicious: number }) => {
 if (!VTresponse) return false;

 let severity = 0;

 if (VTresponse.suspicious) {
  severity = VTresponse.suspicious % 10;
 }

 if (VTresponse.malicious) {
  if (VTresponse.malicious > 1 && VTresponse.malicious < 5) {
   severity += 6;
  } else if (VTresponse.malicious > 50) {
   severity = 100;
  }

  severity += VTresponse.malicious * 2;
 }
 return severity > 2;
};

const inGoogleSafeBrowsing = async (u: string) => {
 const res = await fetch(
  `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${auth.safeBrowsingToken}`,
  {
   method: 'POST',
   body: JSON.stringify({
    client: {
     clientId: 'Ayako Development',
     clientVersion: pack.version,
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
 );

 if (!res.ok) return false;
 return !!((await res.json()) as { matches?: string[] }).matches?.length;
};

const reportFishFish = (u: string) => {
 fetch('https://yuri.bots.lostluma.dev/phish/report', {
  method: 'POST',
  headers: {
   authorization: auth.phishToken,
  },
  body: JSON.stringify({
   url: u,
   reason:
    'Reported by at least one of the following Vendors: Google Safe Browsing, SpamHaus, VirusTotal, Sinking Yachts, PromptAPI, FishFish',
  }),
 });
};

// https://api.fishfish.gg/v1/docs
const inFishFish = async (u: string) => ch.cache.fishFish.cache.has(cleanURL(u));

const performPunishment = (
 msg: Discord.Message<true>,
 settings: Prisma.antivirus,
 language: CT.Language,
) => {
 const baseOptions = {
  dbOnly: false,
  reason: language.deleteReasons.antivirus,
  executor: msg.client.user,
  target: msg.author,
  guild: msg.guild,
 };

 switch (settings.action) {
  case 'ban':
   return ch.mod(msg, 'banAdd', {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deletemessageseconds),
   });
  case 'channelban':
   return ch.mod(msg, 'channelBanAdd', {
    ...baseOptions,
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
   });
  case 'kick':
   return ch.mod(msg, 'kickAdd', baseOptions);
  case 'softban':
   return ch.mod(msg, 'softBanAdd', {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deletemessageseconds),
   });
  case 'strike':
   return ch.mod(msg, 'strikeAdd', baseOptions);
  case 'warn':
   return ch.mod(msg, 'warnAdd', baseOptions);
  case 'tempban':
   return ch.mod(msg, 'tempBanAdd', {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deletemessageseconds),
    duration: Number(settings.duration),
   });
  case 'tempchannelban':
   return ch.mod(msg, 'tempChannelBanAdd', {
    ...baseOptions,
    channel: msg.channel.isThread()
     ? (msg.channel.parent as NonNullable<typeof msg.channel.parent>)
     : msg.channel,
    duration: Number(settings.duration),
   });
  case 'tempmute':
   return ch.mod(msg, 'tempMuteAdd', { ...baseOptions, duration: Number(settings.duration) });
  default:
   throw new Error(`Invalid action: ${settings.action}`);
 }
};

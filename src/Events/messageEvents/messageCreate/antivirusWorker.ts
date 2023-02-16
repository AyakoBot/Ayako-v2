import { parentPort } from 'worker_threads';

// eslint-disable-next-line no-shadow
import fetch from 'node-fetch';
import fs from 'fs';
import jobs from 'node-schedule';

import getJumpLink from '../../../BaseClient/ClientHelperModules/getJumpLink';
import * as util from '../../../BaseClient/ClientHelperModules/util';
import auth from '../../../auth.json' assert { type: 'json' };
import type CT from '../../../Typings/CustomTypings';

type Data = {
  msgData: {
    channelid: string;
    msgid: string;
    guildid: string;
  };
  linkObject: LinkObject;
  lan: CT.Language['antivirus'];
  includedBadLink: boolean;
  check: boolean;
  blacklist: string[];
  whitelist: string[];
  whitelistCDN: string[];
  blocklist: string[];
  badLinks: string[];
};

interface LinkObject {
  href: string;
  url: string;
  hostname: string;
  baseURL: string;
  baseURLhostname: string;
  contentType: string;
}

interface VTAttributes {
  date: number;
  status: 'completed' | 'queued' | 'in-progress';
  stats: {
    'confirmed-timeout': number;
    failure: number;
    harmless: number;
    malicious: number;
    suspicious: number;
    timeout: number;
    'type-unsupported': number;
    undetected: number;
  };
}

interface VTAnalysisResponse {
  meta: {
    url_info: {
      url: string;
      id: string;
    };
  };
  data: {
    attributes: VTAttributes;
    type: 'analysis';
    id: string;
    links: {
      item: string;
      self: string;
    };
  };
}

type PromptAPIResponse = {
  result: {
    domain_name: string;
    registrar: string;
    whois_server: string;
    referral_url: unknown;
    updated_date: string;
    creation_date: string;
    expiration_date: string;
    name_servers: unknown[];
    status: unknown[];
    emails: string;
    dnssec: string;
    name: unknown;
    org: unknown;
    address: unknown;
    city: unknown;
    state: unknown;
    zipcode: unknown;
    country: unknown;
  };
};

parentPort?.on('message', async (data: Data) => {
  run(data);
});

const run = async ({
  msgData,
  linkObject,
  lan,
  includedBadLink,
  check,
  blacklist,
  whitelist,
  whitelistCDN,
  blocklist,
  badLinks,
}: Data) => {
  if (includedBadLink) {
    return;
  }

  const { exists: websiteExists, hrefRes } = await checkIfWebsiteExists(linkObject);
  if (!websiteExists) {
    parentPort?.postMessage({ msgData, lan, linkObject, type: 'doesntExist', check });
    return;
  }

  const note = getNote(blacklist, linkObject);
  if (note) {
    if (!check) {
      includedBadLink = true;
    }

    parentPort?.postMessage({ msgData, lan, linkObject, note, check, type: 'blacklisted' });
    return;
  }

  const isFile = !!(
    linkObject.contentType?.includes('video') ||
    linkObject.contentType?.includes('image') ||
    linkObject.contentType?.includes('audio')
  );

  if (
    (whitelist.includes(linkObject.baseURLhostname) &&
      linkObject.hostname.endsWith(linkObject.baseURLhostname)) ||
    (whitelist.includes(linkObject.baseURLhostname) && !isFile) ||
    (isFile && whitelistCDN.includes(linkObject.baseURLhostname))
  ) {
    parentPort?.postMessage({ msgData, lan, linkObject, check, type: 'whitelisted' });
    return;
  }

  let hrefLogging = false;
  const whitelistCDNindex = whitelistCDN.findIndex((line) =>
    line.startsWith(linkObject.baseURLhostname),
  );
  if (
    isFile &&
    whitelistCDNindex &&
    whitelistCDN[whitelistCDNindex]?.endsWith('requiresAdditionalCheck')
  ) {
    hrefLogging = true;
  } else if (isFile && whitelistCDN.includes(linkObject.baseURLhostname)) {
    parentPort?.postMessage({ msgData, lan, linkObject, check, type: 'whitelisted' });
    return;
  }

  const sinkingYachtsBad = await sinkingYatchtsCheck(linkObject);
  if (sinkingYachtsBad === true) {
    if (!check) {
      includedBadLink = true;
    }

    parentPort?.postMessage({ msgData, lan, linkObject, check, type: 'blacklisted' });
    return;
  }

  const spamHausIncluded = await getSpamHaus(linkObject);

  if (
    badLinks.includes(linkObject.baseURLhostname) ||
    badLinks.includes(linkObject.href) ||
    blocklist.includes(linkObject.baseURLhostname) ||
    blacklist.includes(linkObject.baseURLhostname) ||
    spamHausIncluded
  ) {
    if (!check) {
      includedBadLink = true;
    }

    parentPort?.postMessage({ msgData, lan, linkObject, check, note, type: 'blacklisted' });
    return;
  }

  const urlIsNew = await getURLage(linkObject);
  if (urlIsNew && !Number.isNaN(urlIsNew)) {
    if (!check) {
      includedBadLink = true;
    }

    parentPort?.postMessage({ msgData, lan, linkObject, check, type: 'newUrl' });
    return;
  }

  const postVTurlsRes: VTAttributes | null = await postVTUrls(linkObject);
  const VTurls = postVTurlsRes?.stats;
  const urlSeverity = getSeverity(VTurls);
  if (Number.isNaN(urlSeverity)) {
    parentPort?.postMessage({ type: 'VTfail', msgData, check, linkObject });
    return;
  }

  if (Number(urlSeverity) > 2) {
    if (!check) {
      includedBadLink = true;
    }

    parentPort?.postMessage({
      msgData,
      lan,
      linkObject,
      check,
      urlSeverity,
      type: 'severeLink',
      hrefLogging,
    });
    return;
  }

  const isCloudFlareProtected = checkCloudFlare(hrefRes);
  if (isCloudFlareProtected === true) {
    if (!check) {
      includedBadLink = true;
    }

    parentPort?.postMessage({ msgData, lan, linkObject, check, type: 'cloudFlare' });
    return;
  }

  const attributes = postVTurlsRes;
  if (attributes && !whitelist.includes(linkObject.baseURLhostname)) {
    fs.appendFile(
      '/root/Bots/Website/CDN/antivirus/whitelisted.txt',
      `\n${linkObject.baseURLhostname}`,
      () => null,
    );

    parentPort?.postMessage({
      type: 'send',
      content: `${util.makeCodeBlock(linkObject.baseURLhostname)}\n${getJumpLink({
        guildId: msgData.guildid,
        channelId: msgData.channelid,
        id: msgData.msgid,
      })}`,
      channelid: '726252103302905907',
    });

    parentPort?.postMessage({ msgData, lan, linkObject, check, type: 'whitelisted' });
  }

  if (
    attributes &&
    !whitelist.includes(linkObject.hostname) &&
    linkObject.hostname !== linkObject.baseURLhostname
  ) {
    fs.appendFile(
      '/root/Bots/Website/CDN/antivirus/whitelisted.txt',
      `\n${linkObject.hostname}`,
      () => null,
    );

    parentPort?.postMessage({
      type: 'send',
      content: `${util.makeCodeBlock(linkObject.hostname)}\n${getJumpLink({
        guildId: msgData.guildid,
        channelId: msgData.channelid,
        id: msgData.msgid,
      })}`,
      channelid: '726252103302905907',
    });

    parentPort?.postMessage({ msgData, lan, linkObject, check });
  }
};

interface FetchError {
  type: 'system';
  errno: 'ENOTFOUND';
  code: 'ENOTFOUND';
  erroredSysCall: 'getaddrinfo';
}

const checkIfWebsiteExists = async (linkObject: LinkObject) => {
  const hostname = `${new URL(linkObject.url).protocol}//${linkObject.hostname}`;

  const [hrefRes, urlRes, baseUrlRes, hostnameRes]: (string | FetchError)[] = await Promise.all([
    linkObject.href
      ? fetch(linkObject.href)
          .then((r) => r.text())
          .catch((e) => e)
      : null,
    linkObject.url
      ? fetch(linkObject.url)
          .then((r) => r.text())
          .catch((e) => e)
      : null,
    linkObject.baseURL
      ? fetch(linkObject.baseURL)
          .then((r) => r.text())
          .catch((e) => e)
      : null,
    hostname
      ? fetch(hostname)
          .then((r) => r.text())
          .catch((e) => e)
      : null,
  ]);

  let exists = false;

  if (
    (hrefRes && typeof hrefRes === 'string') ||
    (urlRes && typeof urlRes === 'string') ||
    (baseUrlRes && typeof baseUrlRes === 'string') ||
    (hostnameRes && typeof hostnameRes === 'string')
  ) {
    exists = true;
  }

  const hrefHTML = hrefRes as string;
  return { exists, hrefRes: hrefHTML };
};

const getNote = (blacklist: string[], linkObject: LinkObject) => {
  const include: string[] = [];

  blacklist.forEach((entry) => {
    if (entry.includes('|') && entry.split(/ \| /g)[0] === linkObject.baseURLhostname) {
      include.push(entry);
    }
  });

  return include.find((entry) => entry !== undefined);
};

const getSpamHaus = async (linkObject: LinkObject) => {
  const res = await fetch(
    `https://apibl.spamhaus.net/lookup/v1/dbl/${linkObject.baseURLhostname}`,
    {
      headers: {
        Authorization: `Bearer ${auth.spamhausToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );

  return !!(res && res.status === 200);
};

const getURLage = async (linkObject: LinkObject) => {
  const ageInDays = await promptapi(linkObject);
  if (ageInDays && +ageInDays < 7) {
    return ageInDays;
  }

  return false;
};

const promptapi = async (linkObject: LinkObject) => {
  const promptapiRes: PromptAPIResponse | null = await fetch(
    `https://api.promptapi.com/whois/query?domain=${linkObject.baseURLhostname}`,
    {
      headers: {
        apikey: auth.promptAPIToken,
      },
    },
  )
    .then((res) => res.json() as Promise<PromptAPIResponse>)
    .catch(() => null);

  if (promptapiRes && promptapiRes.result && promptapiRes.result.creation_date) {
    return Math.ceil(
      Math.abs(new Date(promptapiRes.result.creation_date).getTime() - new Date().getTime()) /
        (1000 * 3600 * 24),
    );
  }
  return undefined;
};

type VTSendResponse = { data: { type: string; id: string } };

const postVTUrls = async (linkObject: LinkObject) => {
  if (!linkObject.href) {
    // eslint-disable-next-line no-console
    console.log(linkObject);
  }

  const encodedParams = new URLSearchParams();
  encodedParams.set('url', linkObject.href);

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'x-apikey': auth.VTtoken,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ url: linkObject.href }),
  };

  const res: VTSendResponse | null = await fetch('https://www.virustotal.com/api/v3/urls', options)
    .then((r) => r.json() as Promise<VTSendResponse>)
    .catch(() => null);

  if (res?.data.id) return getNewVTUrls(res.data.id, 0) as unknown as VTAttributes;
  return null;
};

const getNewVTUrls = async (id: string, i: number) => {
  if (i > 5) {
    throw new Error('Too many requests');
  }

  // eslint-disable-next-line no-async-promise-executor
  const res: VTAnalysisResponse | null = await new Promise(async (resolve) => {
    const options = {
      method: 'GET',
      headers: { Accept: 'application/json', 'x-apikey': auth.VTtoken },
    };

    fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, options)
      .then(async (r) => resolve((await r.json()) as Promise<VTAnalysisResponse>))
      .catch(() => resolve(null));
  });

  if (res?.data.attributes.status === 'completed') {
    return res?.data.attributes;
  }

  if (res?.data.attributes.status === 'queued' || res?.data.attributes.status === 'in-progress') {
    return getNewVTUrlsTimeouted(id, 1);
  }

  return null;
};

const getNewVTUrlsTimeouted = async (id: string, i: number) => {
  i += 1;
  const timeout = 5000 * i;

  if (i > 5) {
    throw new Error('Too many Requests');
  }

  const timeoutRes = await new Promise((timeoutResolve) => {
    jobs.scheduleJob(new Date(Date.now() + timeout * i), async () => {
      const res: VTAnalysisResponse | null = await new Promise((resolve) => {
        const options = {
          method: 'GET',
          headers: { Accept: 'application/json', 'x-apikey': auth.VTtoken },
        };

        fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, options)
          .then(async (r) => resolve((await r.json()) as Promise<VTAnalysisResponse>))
          .catch(() => resolve(null));
      });

      if (!res) return timeoutResolve(null);
      if (res.data.attributes.status === 'completed') {
        timeoutResolve(res.data.attributes);
      } else if (
        res.data.attributes.status === 'queued' ||
        res.data.attributes.status === 'in-progress'
      ) {
        timeoutResolve(null);
        timeoutResolve((await getNewVTUrlsTimeouted(id, i)) as never);
      }
      return null;
    });
  });

  if (timeoutRes) {
    return timeoutRes;
  }

  return null;
};

const getSeverity = (VTresponse: VTAttributes['stats'] | string | undefined) => {
  if (!VTresponse) return undefined;
  if (typeof VTresponse === 'string') {
    return undefined;
  }

  if (!VTresponse || typeof VTresponse.suspicious !== 'number') {
    return undefined;
  }

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
  return severity;
};

// https://phish.sinking.yachts/
const sinkingYatchtsCheck = async (linkObject: LinkObject) => {
  const res = await fetch(`https://phish.sinking.yachts/v2/check/${linkObject.baseURLhostname}`, {
    method: 'GET',
    headers: {
      'X-Identity': `Discord Bot - Owner ID ${auth.ownerID}`,
    },
  })
    .then((r) => r.json() as Promise<boolean>)
    .catch(() => null);

  if (typeof res === 'boolean') {
    return res;
  }
  return 'unkown';
};

const checkCloudFlare = (res: string) => {
  if (res) {
    return (
      /https:\/\/www\.cloudflare\.com\/5xx-error-landing/gi.test(res) &&
      /We\sare\schecking\syour\sbrowser/gi.test(res)
    );
  }
  return 'unkown';
};

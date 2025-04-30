import Prisma, { PunishmentType } from '@prisma/client';
import type { GatewayMessageCreateDispatchData } from 'discord-api-types/v10.js';
import util from 'src/BaseClient/Bot/Util.js';
import client, { API, clientUser } from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';
import type { MessageCreateOptions } from 'src/BaseClient/UtilModules/send.js';
import cache from 'src/BaseClient/UtilModules/cache.js';

export default async (msg: GatewayMessageCreateDispatchData) => {
 if (!msg.content) return;
 if (msg.author.bot) return;
 if (!msg.guild_id && clientUser.id !== process.env.MAIN_BOT_ID) return;

 const settings = msg.guild_id
  ? await util.DataBase.antivirus.findUnique({
     where: { guildid: msg.guild_id, active: true },
    })
  : undefined;
 if (!settings && msg.guild_id) return;

 if (!msg.guild_id) {
  await API.channels.addMessageReaction(
   msg.channel_id,
   msg.id,
   util.constants.standard.getEmoteIdentifier(util.emotes.loading),
  );
 }

 const result = await run(msg.content);
 if (!('url' in result)) {
  if (msg.guild_id) return;

  await API.channels.deleteOwnMessageReaction(
   msg.channel_id,
   msg.id,
   util.constants.standard.getEmoteIdentifier(util.emotes.loading),
  );

  if (!result.urls.length) return;

  log(
   settings?.linklogging && settings?.linklogchannels.length
    ? settings.linklogchannels
    : msg.channel_id,
   msg,
   await util.getLanguage(msg.guild_id),
   result,
  );

  return;
 }

 const language = await util.getLanguage(msg.guild_id);

 if (!msg.guild_id || result.triggers) {
  log(
   settings?.linklogging && settings?.linklogchannels.length
    ? settings.linklogchannels
    : msg.channel_id,
   msg,
   language,
   result,
  );
 }

 if (!msg.guild_id) {
  await API.channels.deleteOwnMessageReaction(
   msg.channel_id,
   msg.id,
   util.constants.standard.getEmoteIdentifier(util.emotes.loading),
  );
 }

 if (msg.guild_id && settings?.deletemsg) {
  await util.request.channels.deleteMessage(msg);
 }

 if (msg.guild_id && settings) performPunishment(msg, settings, language, msg);
};

const log = async (
 channels: string[],
 msg: GatewayMessageCreateDispatchData,
 language: CT.Language,
 url: Awaited<ReturnType<typeof run>>,
) => {
 if (!url.url && !url.urls.length) return;

 const payload: MessageCreateOptions = {
  embeds: [
   {
    color: url.triggers ? CT.Colors.Danger : CT.Colors.Success,
    author: {
     name: language.autotypes.antivirus,
     icon_url: util.constants.events.logs.invite.create,
    },
    description: `${language.antivirus.log.value(msg, await util.cache.channels.get(msg.channel_id))}\n\n${language.antivirus.log.name}\n${url.urls
     .map((u) => util.util.makeInlineCode(u))
     .join(', ')}`,
    fields: [
     ...(url.url
      ? [
         { name: '\u200b', value: '\u200b' },
         {
          name: language.antivirus.malicious(
           util.constants.standard.getEmote(util.emotes.crossWithBackground) ?? '❌',
          ),
          value: util.util.makeInlineCode(url.url),
         },
         { name: '\u200b', value: '\u200b' },
        ]
      : [
         {
          name: language.antivirus.clean(
           util.constants.standard.getEmote(util.emotes.tickWithBackground) ?? '✅',
          ),
          value: url.urls.map((u) => util.util.makeInlineCode(u)).join(', '),
         },
        ]),
    ],
   },
  ],
 };

 if (msg.guild_id) {
  util.send({ id: channels as string[], guildId: msg.guild_id }, payload, 10000);
 } else util.send(channels, payload);
};

const run = async (content: string) => {
 const urls = await getURLs(content);
 if (!urls.length) return { triggers: false, urls };

 const lookup = await Promise.all(
  urls.map((u) =>
   fetch('https://api.ayakobot.com/v1/url-scan', {
    method: 'POST',
    body: JSON.stringify({ url: u }),
    headers: { 'Content-Type': 'application/json' },
   }).then((r) => ({ status: r.status, url: u })),
  ),
 );

 if (lookup.some((l) => l.status === 204)) {
  return { triggers: true, urls, url: lookup.find((l) => l.status === 204)?.url };
 }
 if (!lookup.find((l) => l.status === 404)) return { triggers: false, urls };

 const unkownURLs = lookup.filter((l) => l.status === 404).map((l) => l.url);

 const scanIds = await Promise.all(
  unkownURLs.map((u) =>
   fetch('https://api.ayakobot.com/v1/url-scan', {
    method: 'PUT',
    body: JSON.stringify({ url: u }),
    headers: { Authorization: `Bot ${process.env.ayakoToken}`, 'Content-Type': 'application/json' },
   }).then((r) =>
    r.status === 200
     ? r.json().then((j) => ({ scanId: (j as { scanId: string }).scanId, url: u }))
     : null,
   ),
  ),
 );

 const scans = await getScans(
  scanIds.filter((r): r is NonNullable<typeof r> => !!r),
  [],
 );
 if (scans.length) return { triggers: true, urls, url: scans[0] };

 return { triggers: false, urls };
};

const getScans = async (
 scanIds: { scanId: string; url: string }[],
 scans: string[],
 iteration: number = 0,
) => {
 if (iteration >= 5) return scans;

 const results = await Promise.all(
  scanIds
   .filter((s) => !scans.includes(s.url))
   .map((s) =>
    fetch(`https://api.ayakobot.com/v1/url-scan/${s.scanId}`).then((r) => ({
     status: r.status,
     url: s.url,
    })),
   ),
 );

 results.forEach((result) => {
  switch (result.status as 202 | 204 | 409 | 412 | 419) {
   case 409:
    break;
   case 204:
    scans.push(result.url);
    scanIds = scanIds.filter((s) => s.url !== result.url);
    break;
   case 202:
   case 412:
   case 419:
   default: {
    scanIds = scanIds.filter((s) => s.url !== result.url);
    break;
   }
  }
 });

 if (scans.length) return scans;

 await util.sleep(5000);
 return getScans(scanIds, scans, iteration + 1);
};

const getURLs = async (content: string): Promise<string[]> => {
 const urlTLDs = cache.urlTLDs.toArray();
 const urlTester = util.regexes.urlTester(urlTLDs);

 return (
  await Promise.all(
   content
    .replace(/<([^<>]+?)>/g, (m) => m.replace(/[\s\n]+/g, ''))
    // eslint-disable-next-line no-useless-escape
    .replace(/[\[\]\(\)<>]/g, ' ')
    .split(/[\s\n]+/g)
    .filter((line) => /[^.]+\./.test(line))
    .filter((u) => u.match(urlTester))
    .map((arg) => util.fetchWithRedirects(arg)),
  )
 ).flat();
};

export const performPunishment = async (
 rawMessage: GatewayMessageCreateDispatchData | undefined,
 settings: Prisma.antivirus | Prisma.antispam,
 language: CT.Language,
 additionalData: GatewayMessageCreateDispatchData,
) => {
 const msg = rawMessage ?? additionalData;
 if (!msg.guild_id) return;

 const baseOptions = {
  dbOnly: false,
  reason: language.autotypes.antivirus,
  executor: (await util.getBotMemberFromGuild(msg.guild_id))?.user,
  target: msg.author,
  guild: msg.guild_id,
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

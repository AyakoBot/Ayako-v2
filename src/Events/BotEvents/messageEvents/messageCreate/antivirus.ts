import Prisma, { PunishmentType } from '@prisma/client';
import * as Discord from 'discord.js';
import client, { API } from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (msg: Discord.Message) => {
 if (!msg.content) return;
 if (msg.author.bot) return;
 if (!msg.inGuild() && msg.client.user.id !== process.env.MAIN_BOT_ID) return;

 const settings = msg.inGuild()
  ? await client.util.DataBase.antivirus.findUnique({
     where: { guildid: msg.guildId, active: true },
    })
  : undefined;
 if (!settings && msg.inGuild()) return;

 if (!msg.inGuild()) {
  await API.channels.addMessageReaction(
   msg.channelId,
   msg.id,
   client.util.constants.standard.getEmoteIdentifier(client.util.emotes.loading),
  );
 }

 const result = await run(msg.content);
 if (!('url' in result)) {
  if (msg.inGuild()) return;

  await API.channels.deleteOwnMessageReaction(
   msg.channelId,
   msg.id,
   client.util.constants.standard.getEmoteIdentifier(client.util.emotes.loading),
  );

  if (!result.urls.length) return;

  log(
   settings?.linklogging && settings?.linklogchannels.length
    ? settings.linklogchannels
    : msg.channel,
   msg,
   await client.util.getLanguage(msg.guildId),
   result,
  );

  return;
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

 if (msg.inGuild() && settings?.deletemsg) {
  await msg.client.util.request.channels.deleteMessage(msg);
 }

 if (msg.inGuild() && settings) performPunishment(msg, settings, language, msg);
};

const log = (
 channels: string[] | Discord.Message<false>['channel'],
 msg: Discord.Message,
 language: CT.Language,
 url: Awaited<ReturnType<typeof run>>,
) => {
 if (!url.url && !url.urls.length) return;

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
           client.util.constants.standard.getEmote(client.util.emotes.crossWithBackground) ?? '❌',
          ),
          value: client.util.util.makeInlineCode(url.url),
         },
         { name: '\u200b', value: '\u200b' },
        ]
      : [
         {
          name: language.antivirus.clean(
           client.util.constants.standard.getEmote(client.util.emotes.tickWithBackground) ?? '✅',
          ),
          value: url.urls.map((u) => client.util.util.makeInlineCode(u)).join(', '),
         },
        ]),
    ],
   },
  ],
 };

 if (msg.inGuild()) {
  client.util.send({ id: channels as string[], guildId: msg.guildId }, payload, 10000);
 } else client.util.send(channels as Discord.TextBasedChannel, payload);
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

 await client.util.sleep(5000);
 return getScans(scanIds, scans, iteration + 1);
};

export const getURLs = async (content: string): Promise<string[]> => {
 const urlTLDs = client.util.cache.urlTLDs.toArray();
 const urlTester = client.util.regexes.urlTester(urlTLDs);

 return (
  await Promise.all(
   content
    .replace(/<([^<>]+?)>/g, (m) => m.replace(/[\s\n]+/g, ''))
    // eslint-disable-next-line no-useless-escape
    .replace(/[\[\]\(\)<>]/g, ' ')
    .split(/[\s\n]+/g)
    .filter((line) => line.match(/[^.]+\./)?.length)
    .filter((u) => u.match(urlTester))
    .map((arg) => client.util.fetchWithRedirects(arg)),
  )
 ).flat();
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

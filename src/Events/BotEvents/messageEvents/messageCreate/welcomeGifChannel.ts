import type { Message } from 'discord.js';
import { getURLs } from './antivirus.js';

export default async (msg: Message<true>) => {
 const welcomeSettings = await msg.client.util.DataBase.welcome.findFirst({
  where: { guildid: msg.guildId, gifChannelId: msg.channelId },
 });
 if (!welcomeSettings) return;
 if (welcomeSettings.gifChannelId !== msg.channelId) return;

 const contentURLs = await getURLs(msg.content).then((urls) =>
  urls.filter((url) => !url.includes('tenor.com')),
 );

 const videoURLs = msg.embeds
  ?.map((e) => convertTenorToGIF(e.video?.url))
  .flat()
  .filter((u): u is string => !!u?.length);

 msg.client.util.DataBase.welcomeGIF
  .createMany({
   data: [...msg.attachments.map((a) => a.url), ...contentURLs.flat(), ...videoURLs]
    .filter((u) => !!u.length)
    .map((url) => ({
     guildId: msg.guild.id,
     channelId: msg.channel.id,
     msgId: msg.id,
     url,
    })),
  })
  .then();
};

export const convertTenorToGIF = (url?: string) =>
 url && url.includes('tenor.com') && !url.includes('c.tenor.com')
  ? `https://c.tenor.com/${url.split(/\/+/g)[2]?.slice(0, -2)}AC/tenor.gif`
  : url;

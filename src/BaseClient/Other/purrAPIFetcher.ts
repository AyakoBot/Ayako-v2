// eslint-disable-next-line no-shadow
import fetch from 'node-fetch';

interface PurrBotAPIResponse {
 link: string;
 time: number;
 error: boolean;
}

export type GifName =
 | 'bite'
 | 'blush'
 | 'comfy'
 | 'cry'
 | 'cuddle'
 | 'dance'
 | 'fluff'
 | 'hug'
 | 'kiss'
 | 'lick'
 | 'pat'
 | 'poke'
 | 'slap'
 | 'smile'
 | 'tail'
 | 'tickle';

export default async (gifName: GifName, fileType: 'gif' | 'img' = 'gif') => {
 const res = await fetch(`https://purrbot.site/api/img/sfw/${gifName}/${fileType}`, {
  method: 'GET',
 }).then((r) => r.json() as Promise<PurrBotAPIResponse>);

 if (res && res.error === false) return res.link;
 return null;
};

// eslint-disable-next-line no-shadow
import fetch from 'node-fetch';

interface PurrBotAPIResponse {
  link: string;
  time: number;
  error: boolean;
}

export default async (gifName: string) => {
  const res = await fetch(`https://purrbot.site/api/img/sfw/${gifName}/gif`, {
    method: 'GET',
  }).then((r) => r.json() as Promise<PurrBotAPIResponse>);

  if (res && res.error === false) return res.link;
  return null;
};

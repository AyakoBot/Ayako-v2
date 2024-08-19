const APIDiscords = 'https://discords.com/bots/api/bot/650691698409734151/setservers';

export default (guilds: number) =>
 fetch(APIDiscords, {
  method: 'post',
  headers: {
   Authorization: process.env.discords ?? '',
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({ server_count: guilds }),
 }).then(async (r) => (r.ok ? undefined : console.log(await r.text())));

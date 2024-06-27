const APIDiscordBots = 'https://discord.bots.gg/api/v1/bots/650691698409734151/stats';

export default (guilds: number) => {
 fetch(APIDiscordBots, {
  method: 'post',
  body: JSON.stringify({
   guildCount: guilds,
  }),
  headers: {
   'Content-Type': 'application/json',
   Authorization: process.env.DBToken ?? '',
  },
 }).then(async (r) => (r.ok ? undefined : console.log(await r.text())));
};

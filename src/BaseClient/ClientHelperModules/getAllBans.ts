import * as Discord from 'discord.js';
import { request } from './requestHandler.js';
import * as Classes from '../Other/classes.js';

export default async (guild: Discord.Guild) => {
 const fetchBans = (after?: string) => request.guilds.getMemberBans(guild, { limit: 1000, after });

 const bans: Discord.GuildBan[] = [];

 let wasntThousand = false;
 while (wasntThousand === false) {
  // eslint-disable-next-line no-await-in-loop
  const fetched = await fetchBans(bans.at(-1)?.user.id);
  if ('message' in fetched) {
   wasntThousand = true;
   return [];
  }

  if (fetched?.length !== 1000) wasntThousand = true;

  bans.push(...fetched.map((b) => new Classes.GuildBan(guild.client, b, guild)));
 }

 return bans;
};

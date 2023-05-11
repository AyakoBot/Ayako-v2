import * as Discord from 'discord.js';
import type * as CT from '../../Typings/CustomTypings';
import type * as DBT from '../../Typings/DataBaseTypings';
import query from './query.js';

export default async (user: Discord.User | CT.bEvalUser) => {
 const dbUser = await query(`SELECT * FROM users WHERE userid = $1;`, [user.id]).then(
  (r: DBT.users[] | null) => r?.[0],
 );

 return dbUser?.accesstoken;
};

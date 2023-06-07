import query from './query.js';
import * as DBT from '../../Typings/DataBaseTypings.js';

const returnFields =
 'guildid, reason, channelname, channelid, uniquetimestamp, userid, executorid, executorname, msgid';

type Returned = DBT.TempPunishment & {
 type: 'punish_bans' | 'punish_channlebans' | 'punish_kicks' | 'punish_mutes' | 'punish_warns';
};

function f(id: number): Promise<Returned | null>;
function f(id: number, identType: 'between', ident: number): Promise<Returned[] | null>;
function f(id: string, identType: 'by', ident: 'string'): Promise<Returned[] | null>;
function f(
 id: string,
 identType: 'with-type',
 ident: Parameters<typeof getWithType>[1],
): Promise<DBT.TempPunishment[] | null>;
function f(id: string, identType: 'all-by' | 'all-on'): Promise<Returned[] | null>;
function f(id: number, identType: 'after' | 'before'): Promise<Returned[] | null>;
async function f(
 id: number | string,
 identType?: 'after' | 'before' | 'between' | 'by' | 'all-on' | 'all-by' | 'with-type',
 ident?: string | number,
): Promise<Returned | Returned[] | DBT.TempPunishment[] | null> {
 let where = '';
 const args: (string | number)[] = [];
 let asArray = true;

 switch (identType) {
  case 'with-type': {
   return getWithType(id as string, ident as Parameters<typeof getWithType>[1]) as Promise<
    DBT.TempPunishment[] | null
   >;
  }
  case 'all-on': {
   where = 'userid = $1';
   args.push(id);
   break;
  }
  case 'by': {
   where = 'userid = $1 AND executorid = $2';
   args.push(id, ident as string);
   break;
  }
  case 'all-by': {
   where = 'executorid = $1';
   args.push(id);
   break;
  }
  case 'between': {
   where = 'uniquetimestamp BETWEEN $1 AND $2';
   args.push(id, ident as number);
   break;
  }
  case 'before': {
   where = 'uniquetimestamp < $1';
   args.push(id);
   break;
  }
  case 'after': {
   where = 'uniquetimestamp > $1';
   args.push(id);
   break;
  }
  default: {
   where = 'uniquetimestamp = $1';
   args.push(id);
   asArray = false;
  }
 }

 return query(
  `WITH user_punishments AS (
       SELECT ${returnFields}, 'punish_bans' as type FROM punish_bans WHERE ${where} 
       UNION ALL
       SELECT ${returnFields}, 'punish_channelbans' as type FROM punish_channelbans WHERE ${where}
       UNION ALL
       SELECT ${returnFields}, 'punish_kicks' as type FROM punish_kicks WHERE ${where}
       UNION ALL
       SELECT ${returnFields}, 'punish_mutes' as type FROM punish_mutes WHERE ${where}
       UNION ALL
       SELECT ${returnFields}, 'punish_warns' as type FROM punish_warns WHERE ${where} 
     ) SELECT * FROM user_punishments;`,
  args,
  { returnType: 'unknown', asArray: asArray as never },
 ) as unknown as Returned;
}

export default f;

const getWithType = (id: string, type: 'warn' | 'mute' | 'ban' | 'channelban' | 'kick') => {
 switch (type) {
  case 'warn': {
   return query(`SELECT * FROM punish_warns WHERE userid = $1;`, [id], {
    returnType: 'unknown',
    asArray: true,
   });
  }
  case 'mute': {
   return query(`SELECT * FROM punish_mutes WHERE userid = $1;`, [id], {
    returnType: 'unknown',
    asArray: true,
   });
  }
  case 'ban': {
   return query(`SELECT * FROM punish_bans WHERE userid = $1;`, [id], {
    returnType: 'unknown',
    asArray: true,
   });
  }
  case 'channelban': {
   return query(`SELECT * FROM punish_channelbans WHERE userid = $1;`, [id], {
    returnType: 'unknown',
    asArray: true,
   });
  }
  case 'kick': {
   return query(`SELECT * FROM punish_kicks WHERE userid = $1;`, [id], {
    returnType: 'unknown',
    asArray: true,
   });
  }
  default: {
   throw new Error('Unkown type');
  }
 }
};

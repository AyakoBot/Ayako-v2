import pool from '../DataBase.js';
import type * as DBT from '../../Typings/DataBaseTypings';

const { log } = console;
const debugEnabled = process.argv.includes('--debug-db');

function query<T extends keyof DBT.DBTables>(
 string: string,
 args?: unknown[],
 options?: {
  debug?: boolean;
  returnType: T;
  asArray: true;
 },
): Promise<DBT.DBTables[T][] | undefined>;
function query<T extends keyof DBT.DBTables>(
 string: string,
 args?: unknown[],
 options?: {
  debug?: boolean;
  returnType: T;
  asArray: false;
 },
): Promise<DBT.DBTables[T] | undefined>;
async function query<T extends keyof DBT.DBTables>(
 string: string,
 args?: unknown[],
 options?: {
  debug?: boolean;
  returnType: T;
  asArray: boolean;
 },
): Promise<DBT.DBTables[T] | DBT.DBTables[T][] | undefined> {
 if (options?.debug || debugEnabled) log(string, args);

 const res = await pool.postgres.query(string, args).catch((err) => {
  log(string, args);
  throw new Error(err);
 });

 if (options?.debug || debugEnabled) log(res);

 if (!res || !res.rows || !res.rows.length) return undefined;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 if (options?.asArray) return res.rows;
 return res.rows[0];
}

export default query;

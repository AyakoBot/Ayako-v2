import pool from '../DataBase.js';
import type * as DBT from '../../Typings/DataBaseTypings';

// eslint-disable-next-line no-console
const { log } = console;

function query<T extends keyof DBT.DBTables>(
 string: string,
 args?: unknown[],
 options?: {
  debug?: false;
  returnType: T;
  asArray: true;
 },
): Promise<DBT.DBTables[T][] | undefined>;
function query<T extends keyof DBT.DBTables>(
 string: string,
 args?: unknown[],
 options?: {
  debug?: false;
  returnType: T;
  asArray: false;
 },
): Promise<DBT.DBTables[T] | undefined>;
async function query<T extends keyof DBT.DBTables>(
 string: string,
 args?: unknown[],
 options?: {
  debug?: false;
  returnType: T;
  asArray: boolean;
 },
): Promise<DBT.DBTables[T] | DBT.DBTables[T][] | undefined> {
 if (options?.debug) log(string, args);

 const res = await pool.query(string, args).catch((err) => {
  log(string, args);
  throw new Error(err);
 });

 if (options?.debug) log(res);

 if (!res || !res.rowCount) return undefined;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 if (options?.asArray) return res.rows;
 return res.rows[0];
}

export default query;

import pool from '../DataBase.js';

export default async (string: string, args?: unknown[], debug?: boolean) => {
 // eslint-disable-next-line no-console
 if (debug) console.log(string, args);

 const res = await pool.query(string, args).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(string, args);
  throw new Error(err);
 });

 // eslint-disable-next-line no-console
 if (debug) console.log(res);

 if (!res || !res.rowCount) return null;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 return res.rows;
};

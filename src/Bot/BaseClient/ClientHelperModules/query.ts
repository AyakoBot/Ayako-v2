import pool from '../DataBase.js';

export default async (
  string: string,
  args?: (
    | string
    | number
    | boolean
    | null
    | undefined
    | (string | number | boolean | null | undefined)[]
  )[],
  debug?: boolean,
) => {
  // eslint-disable-next-line no-console
  if (debug) console.log(string, args);

  const res = await pool
    .query(string, args as (string | number | boolean | null)[])
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(string, args);
      throw new Error(err);
    });

  if (!res || !res.length) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as unknown as any[];
};

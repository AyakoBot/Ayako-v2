import fetch from 'node-fetch';
import auth from '../../auth.json' assert { type: 'json' };
import query from './query.js';

export default async (refreshtoken: string) => {
 const response = await fetch('https://discord.com/api/v10/oauth2/token', {
  method: 'POST',
  body: new URLSearchParams({
   client_id: auth.mainID,
   client_secret: auth.secret,
   grant_type: 'refresh_token',
   refresh_token: refreshtoken,
  }),
  headers: {
   'Content-Type': 'application/x-www-form-urlencoded',
  },
 });

 if (!response.ok) return undefined;
 const res = (await response.json()) as { access_token: string; expires_in: number };

 query(`UPDATE users SET accesstoken = $1, expires = $3 WHERE refreshtoken = $2;`, [
  res.access_token,
  refreshtoken,
  res.expires_in * 1000 + Date.now(),
 ]);

 return res.access_token;
};

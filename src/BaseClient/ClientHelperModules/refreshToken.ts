import auth from '../../auth.json' assert { type: 'json' };
import query from './query.js';
import * as Client from '../Client.js';

export default async (refreshtoken: string) => {
 const res = await Client.OAuth2Client.refreshToken({
  client_id: Client.default.user?.id as string,
  client_secret: auth.secret,
  grant_type: 'refresh_token',
  refresh_token: refreshtoken,
 });

 query(`UPDATE users SET accesstoken = $1, expires = $3 WHERE refreshtoken = $2;`, [
  res.access_token,
  refreshtoken,
  res.expires_in * 1000 + Date.now(),
 ]);

 return res.access_token;
};

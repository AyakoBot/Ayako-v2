import DataBase from '../Bot/DataBase.js';
import * as Client from '../Bot/Client.js';

/**
 * Refreshes the access token using the provided refresh token
 * and updates the database with the new access token and expiration time.
 * @param refreshtoken - The refresh token to use for refreshing the access token.
 * @returns The new access token.
 */
export default async (refreshtoken: string) => {
 const res = await Client.API.oauth2.refreshToken({
  client_id: Client.default.user?.id as string,
  client_secret: process.env.secret ?? '',
  grant_type: 'refresh_token',
  refresh_token: refreshtoken,
 });

 DataBase.users
  .updateMany({
   where: { refreshtoken },
   data: {
    accesstoken: res.access_token,
    expires: res.expires_in * 1000 + Date.now(),
   },
  })
  .then();

 return res.access_token;
};

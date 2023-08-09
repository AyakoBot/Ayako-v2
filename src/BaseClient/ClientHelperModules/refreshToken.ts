import auth from '../../auth.json' assert { type: 'json' };
import DataBase from '../DataBase.js';
import * as Client from '../Client.js';

export default async (refreshtoken: string) => {
 const res = await Client.OAuth2API.refreshToken({
  client_id: Client.default.user?.id as string,
  client_secret: auth.secret,
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

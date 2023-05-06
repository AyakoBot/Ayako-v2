import io from 'socket.io-client';
import type CT from '../../../Typings/CustomTypings.js';
import auth from '../../../auth.json' assert { type: 'json' };
import appealCreate from '../../appealEvents/apealCreate/appealCreate.js';

export default async () => {
 const socket = io('https://api.ayakobot.com', {
  transports: ['websocket'],
  auth: {
   reason: 'appeal',
   code: auth.socketToken,
  },
 });

 socket.on('appeal', async (appeal: CT.Appeal) => {
  appealCreate(appeal);
 });
};

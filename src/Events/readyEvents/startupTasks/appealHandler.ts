import io from 'socket.io-client';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings.js';
import auth from '../../../auth.json' assert { type: 'json' };

export default async () => {
  const socket = io('https://ayakobot.com', {
    transports: ['websocket'],
    auth: {
      reason: 'appeal',
      code: auth.socketToken,
    },
  });

  socket.on('appeal', async (appeal: CT.Appeal) => client.emit('appealCreate', appeal));
};

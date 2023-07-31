import io from 'socket.io-client';
import auth from '../auth.json' assert { type: 'json' };

export default io('https://api.ayakobot.com', {
 transports: ['websocket'],
 auth: {
  reason: 'botClient',
  code: auth.socketToken,
 },
});

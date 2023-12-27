import io from 'socket.io-client';

export default io('https://api.ayakobot.com', {
 transports: ['websocket'],
 auth: {
  reason: 'botClient',
  code: process.env.socketToken ?? '',
 },
});

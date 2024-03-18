import DataBase from '../../BaseClient/Bot/DataBase.js';

export default (message: string) => {
 if (message.includes('Heartbeat')) {
  const shard = message.split(']')[0].split(/\s+/g).at(-1) ?? '';
  const ms = message.split(' ').at(-1)?.replace(/\D/g, '') ?? '';

  DataBase.heartbeats
   .upsert({
    where: { shard },
    update: { ms },
    create: { shard, ms },
   })
   .then();
 }

 // eslint-disable-next-line no-console
 console.log(message);
};

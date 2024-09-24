import Redis from 'ioredis';

const client = new Redis({ host: 'redis' });

export default client;

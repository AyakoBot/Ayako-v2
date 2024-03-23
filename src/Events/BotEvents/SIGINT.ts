import * as Jobs from 'node-schedule';
import client from '../../BaseClient/Bot/Client.js';
import prisma from '../../BaseClient/Bot/DataBase.js';

export default async () => {
 // eslint-disable-next-line no-console
 console.log('SIGINT detected, exiting...');
 await prisma.$disconnect();
 await client.destroy();
 await Jobs.gracefulShutdown();

 process.exit(0);
};

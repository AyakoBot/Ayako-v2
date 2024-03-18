import prisma from '../../BaseClient/Bot/DataBase.js';
import client from '../../BaseClient/Bot/Client.js';

export default async () => {
 // eslint-disable-next-line no-console
 console.log('SIGINT detected, exiting...');
 await prisma.$disconnect();
 await client.destroy();

 process.exit(0);
};

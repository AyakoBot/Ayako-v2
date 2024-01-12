import prisma from '../../BaseClient/Bot/DataBase.js';
import log from '../../BaseClient/UtilModules/logError.js';

export default async () => {
 log('SIGINT detected, exiting...', true);
 await prisma.$disconnect();

 process.exit(0);
};

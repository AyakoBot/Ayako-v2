import prisma from '../BaseClient/DataBase.js';
import log from '../BaseClient/ClientHelperModules/logError.js';

export default async () => {
 log('SIGINT detected, exiting...', true);
 await prisma.$disconnect();

 process.exit(0);
};

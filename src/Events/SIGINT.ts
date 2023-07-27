import prisma from '../BaseClient/DataBase.js';

const { log } = console;

export default async () => {
 log('SIGINT detected, exiting...');
 await prisma.$disconnect();

 process.exit(0);
};

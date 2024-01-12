/* eslint-disable no-console */
import 'dotenv/config';
import * as DiscordRest from '@discordjs/rest';
import * as DiscordCore from '@discordjs/core';
import commands from './SlashCommands/index.js';
import DataBase from './BaseClient/Bot/DataBase.js';

const createCommands = Object.values(commands.public);

const requestHandler = (token: string) =>
 new DiscordCore.API(new DiscordRest.REST({ version: '10' }).setToken(token.replace('Bot ', '')));

requestHandler(process.env.Token ?? '')
 .applicationCommands.bulkOverwriteGlobalCommands(
  Buffer.from(process.env.Token?.replace('Bot ', '')?.split('.')[0] ?? '0', 'base64').toString() ??
   '',
  createCommands.map((c) => c.toJSON()),
 )
 .then((r) => console.log(`[MAIN] Registered ${r.length} Global Commands`));

(
 await DataBase.guildsettings.findMany({ where: { token: { not: null }, appid: { not: null } } })
).forEach(async (s) => {
 const api = requestHandler(s.token ?? '');

 await api.applicationCommands
  .bulkOverwriteGlobalCommands(
   s.appid ?? '',
   createCommands.map((c) => c.toJSON()),
  )
  .then((r) => console.log(`[CUSTOM] Registered ${r.length} Global Commands`));
});

setTimeout(async () => {
 console.log('Finished. Exiting...');

 await DataBase.$disconnect();
 process.exit(0);
}, 10000);

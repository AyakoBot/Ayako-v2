/* eslint-disable no-console */
import * as DiscordCore from '@discordjs/core';
import * as DiscordRest from '@discordjs/rest';
import 'dotenv/config';
import fetch from 'node-fetch';
import DataBase from './BaseClient/Bot/DataBase.js';
import commands from './SlashCommands/index.js';

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

fetch('https://discordbotlist.com/api/v1/bots/650691698409734151/commands', {
 method: 'post',
 headers: {
  Authorization: process.env.DBListToken ?? '',
  'Content-Type': 'application/json',
 },
 body: JSON.stringify(createCommands.map((c) => c.toJSON())),
});

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

import { parentPort } from 'worker_threads';
import * as Discord from 'discord.js';
import Prisma from '@prisma/client';

interface Data {
 roles: string[];
 guildid: string;
 userid: string;
 guildroles: Map<string, Discord.Role>;
 highest: Discord.Role;
 res: Prisma.roleseparator[];
}

parentPort?.on('message', (data: Data) => {
 start(data);
});

const start = async (data: Data) => {
 const { roles, userid, res: rows, highest: highestRole, guildid } = data;

 const guildroles = new Discord.Collection(data.guildroles);

 const giveThese: string[] = [];
 const takeThese: string[] = [];

 rows.forEach(async (row) => {
  const separator = row.separator ? guildroles.get(row.separator) : undefined;
  if (!separator) {
   parentPort?.postMessage(['NO_SEP', null, [row.separator]]);
   return;
  }

  if (row.isvarying) {
   handleVarying(row, guildroles, separator, highestRole, roles, giveThese, takeThese);
  } else handleNonVarying(row, roles, separator, giveThese, takeThese);
 });

 const newRoles = [...roles, ...giveThese];
 takeThese.forEach((r) => newRoles.splice(newRoles.indexOf(r), 1));

 if (giveThese.length) {
  parentPort?.postMessage(['GIVE', { userid, guildid }, giveThese]);
 }

 if (takeThese.length) {
  parentPort?.postMessage(['TAKE', { userid, guildid }, takeThese]);
 }
};

const handleVarying = (
 row: Prisma.roleseparator,
 guildroles: Discord.Collection<string, Discord.Role>,
 sep: Discord.Role,
 highestRole: Discord.Role,
 roles: string[],
 giveThese: string[],
 takeThese: string[],
) => {
 const stopRole = row.stoprole ? guildroles.get(row.stoprole) : null;
 const affectedRoles = [];
 if (stopRole) {
  if (sep.position > stopRole.position) {
   for (let i = stopRole.position + 1; i < highestRole.position && i < sep.position; i += 1) {
    affectedRoles.push(guildroles.find((r) => r.position === i));
   }
  } else {
   for (let i = sep.position + 1; i < highestRole.position && i < stopRole.position; i += 1) {
    affectedRoles.push(guildroles.find((r) => r.position === i));
   }
  }
 } else if (sep.position < highestRole.position) {
  for (let i = sep.position + 1; i < highestRole.position && i < highestRole.position; i += 1) {
   affectedRoles.push(guildroles.find((r) => r.position === i));
  }
 }

 const has: boolean[] = [];

 affectedRoles
  .map((o) => o)
  .forEach((role) => {
   if (role) {
    if (roles.includes(role.id)) has.push(true);
    else has.push(false);
   }
  });

 if (has.includes(true) && !roles.includes(sep.id)) giveThese.push(sep.id);
 else if (!has.includes(true) && roles.includes(sep.id)) takeThese.push(sep.id);
};

const handleNonVarying = (
 row: Prisma.roleseparator,
 roles: string[],
 sep: Discord.Role,
 giveThese: string[],
 takeThese: string[],
) => {
 const has: boolean[] = [];

 row.roles?.forEach((role) => {
  if (roles.includes(role)) has.push(true);
  else has.push(false);
 });

 if (has.includes(true) && !roles.includes(sep.id)) giveThese.push(sep.id);
 else if (!has.includes(true) && roles.includes(sep.id)) takeThese.push(sep.id);
};

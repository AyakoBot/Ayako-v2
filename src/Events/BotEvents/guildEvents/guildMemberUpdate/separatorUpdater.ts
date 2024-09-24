import Prisma from '@prisma/client';
import { type Serialized } from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import { parentPort } from 'worker_threads';

interface Data {
 roles: string[];
 guildid: string;
 userid: string;
 guildroles: Map<string, { position: number; id: string }>;
 highest: { position: number; id: string };
 res: Serialized<Prisma.roleseparator[]>;
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
  const sep = row.separator ? guildroles.get(row.separator) : undefined;
  if (!sep) {
   parentPort?.postMessage(['NO_SEP', null, [row.separator]]);
   return;
  }

  if (row.isvarying) handleDynamic(row, guildroles, sep, highestRole, roles, giveThese, takeThese);
  else handleConstant(row, roles, sep, giveThese, takeThese);
 });

 const newRoles = [...roles, ...giveThese];
 takeThese.forEach((r) => newRoles.splice(newRoles.indexOf(r), 1));

 if (giveThese.length) parentPort?.postMessage(['GIVE', { userid, guildid }, giveThese]);
 if (takeThese.length) parentPort?.postMessage(['TAKE', { userid, guildid }, takeThese]);
};

const handleDynamic = (
 row: Serialized<Prisma.roleseparator>,
 guildroles: Discord.Collection<string, { position: number; id: string }>,
 sep: { position: number; id: string },
 highestRole: { position: number; id: string },
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

const handleConstant = (
 row: Serialized<Prisma.roleseparator>,
 roles: string[],
 sep: { position: number; id: string },
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

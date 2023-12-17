import { parentPort, workerData } from 'worker_threads';
import Jobs from 'node-schedule';
import Prisma from '@prisma/client';

type PassObject = {
 members: {
  id: string;
  roles: { id: string; position: number }[];
  giveTheseRoles: string[];
  takeTheseRoles: string[];
 }[];
 separators: {
  separator: { id: string; position: number };
  stoprole?: { id: string; position: number };
 }[];
 rowroles: {
  id: string;
  position: number;
 }[];
 roles: { id: string; position: number }[];
 highestRole: { id: string; position: number };
 clientHighestRole: { id: string; position: number };
};

const start = async (wd: { obj: PassObject; res: Prisma.roleseparator[] }) => {
 const { res, obj } = wd;
 const membersWithRoles: PassObject['members'] = [];

 obj.members.forEach((member) => {
  const giveThese: string[] = [];
  const takeThese: string[] = [];
  const memberRoleIds = new Set(member.roles.map((o) => o.id));

  res.forEach((row) => {
   const sep = obj.separators.find((s) => s.separator.id === row.separator)?.separator;
   if (!sep) return;

   if (row.isvarying) {
    const roles = obj.roles.map((o) => o);
    const affectedRoles: ({ id: string; position: number } | undefined)[] = [];
    const stoprole = row.stoprole
     ? obj.separators.find((s) => s.separator.id === row.separator)?.stoprole
     : null;

    if (row.stoprole && stoprole) {
     if (sep.position > stoprole.position) {
      for (let i = stoprole.position + 1; i < roles.length && i < sep.position; i += 1) {
       affectedRoles.push(obj.roles.find((r) => r.position === i));
      }
     } else {
      for (let i = sep.position + 1; i < roles.length && i < stoprole.position; i += 1) {
       affectedRoles.push(obj.roles.find((r) => r.position === i));
      }
     }
    } else if (sep.position < obj.highestRole.position) {
     for (let i = sep.position + 1; i < roles.length && i < obj.highestRole.position; i += 1) {
      affectedRoles.push(obj.roles.find((r) => r.position === i));
     }
    }

    const hasRole = affectedRoles.some((role) => role && memberRoleIds.has(role.id));
    if (hasRole && !memberRoleIds.has(sep.id) && obj.clientHighestRole.position > sep.position) {
     giveThese.push(sep.id);
    } else if (
     !hasRole &&
     memberRoleIds.has(sep.id) &&
     obj.clientHighestRole.position > sep.position
    ) {
     takeThese.push(sep.id);
    }
   } else {
    const hasRole = row.roles?.some((role) => memberRoleIds.has(role));

    if (hasRole && !memberRoleIds.has(sep.id) && obj.clientHighestRole.position > sep.position) {
     giveThese.push(sep.id);
    } else if (
     !hasRole &&
     memberRoleIds.has(sep.id) &&
     obj.clientHighestRole.position > sep.position
    ) {
     takeThese.push(sep.id);
    }
   }
  });

  if (giveThese.length) member.giveTheseRoles = giveThese;
  if (takeThese.length) member.takeTheseRoles = takeThese;
  if (takeThese.length || giveThese.length) membersWithRoles.push(member);
 });

 Jobs.scheduleJob('*/1 * * * * *', () => {
  parentPort?.postMessage(membersWithRoles);
 });
};

start(workerData);

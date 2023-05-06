import { parentPort, workerData } from 'worker_threads';
import jobs from 'node-schedule';
import type DBT from '../../../Typings/DataBaseTypings';

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

start(workerData);

async function start(wd: { obj: PassObject; res: DBT.roleseparator[] }) {
 const { res, obj } = wd;
 const membersWithRoles: PassObject['members'] = [];

 const resolved = await new Promise((resolve) => {
  obj.members.forEach((member, indexMember) => {
   const giveThese: string[] = [];
   const takeThese: string[] = [];
   res.forEach(async (row) => {
    const sep = obj.separators.find((s) => s.separator.id === row.separator)?.separator;
    if (!sep) return;
    if (row.isvarying) {
     const affectedRoles: ({ id: string; position: number } | undefined)[] = [];
     const roles = obj.roles.map((o) => o);
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
     const has: boolean[] = [];
     affectedRoles.forEach((role) => {
      if (role) {
       if (member.roles.map((o) => o.id).includes(role.id)) has.push(true);
       else has.push(false);
      }
     });
     if (
      has.includes(true) &&
      !member.roles.map((o) => o.id).includes(sep.id) &&
      obj.clientHighestRole.position > sep.position
     ) {
      giveThese.push(sep.id);
     } else if (
      !has.includes(true) &&
      member.roles.map((o) => o.id).includes(sep.id) &&
      obj.clientHighestRole.position > sep.position
     ) {
      takeThese.push(sep.id);
     }
    } else {
     const has: boolean[] = [];
     row.roles?.forEach((role) => {
      if (member.roles.map((o) => o.id).includes(role)) has.push(true);
      else has.push(false);
     });
     if (
      has.includes(true) &&
      !member.roles.map((o) => o.id).includes(sep.id) &&
      obj.clientHighestRole.position > sep.position
     ) {
      giveThese.push(sep.id);
     } else if (
      !has.includes(true) &&
      member.roles.map((o) => o.id).includes(sep.id) &&
      obj.clientHighestRole.position > sep.position
     ) {
      takeThese.push(sep.id);
     }
    }
   });
   if (giveThese.length) member.giveTheseRoles = giveThese;
   if (takeThese.length) member.takeTheseRoles = takeThese;
   if (takeThese.length || giveThese.length) membersWithRoles.push(member);
   if (indexMember === obj.members.length - 1) resolve(true);
  });
 });

 jobs.scheduleJob('*/1 * * * * *', () => {
  if (resolved) parentPort?.postMessage(membersWithRoles);
 });
}

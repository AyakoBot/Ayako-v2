import { Serialized } from 'discord-hybrid-sharding';
import Prisma from '@prisma/client';
import Jobs from 'node-schedule';
import { parentPort, workerData } from 'worker_threads';

type Role = { id: string; position: number };

export type PassObject = {
 members: {
  id: string;
  roles: Role[];
  giveTheseRoles: Set<string>;
  takeTheseRoles: Set<string>;
 }[];
 separators: {
  separator: Role;
  stoprole?: Role;
 }[];
 rowroles: {
  id: string;
  position: number;
 }[];
 roles: Role[];
 highestRole: Role;
 clientHighestRole: Role;
};

const start = async (wd: { obj: PassObject; res: Serialized<Prisma.roleseparator[]> }) => {
 const { res, obj } = wd;
 const membersWithRoles: PassObject['members'] = [];

 obj.members.forEach((member) => {
  const giveThese: Set<string> = new Set();
  const takeThese: Set<string> = new Set();
  const memberRoleIds = new Set(member.roles.map((o) => o.id));

  res.forEach((row) => {
   const sep = obj.separators.find((s) => s.separator.id === row.separator)?.separator;
   if (!sep) return;

   if (row.isvarying) handleDynamic(obj, row, sep, memberRoleIds, giveThese, takeThese);
   else handleConstant(obj, row, sep, memberRoleIds, giveThese, takeThese);
  });

  member.giveTheseRoles = giveThese;
  member.takeTheseRoles = takeThese;
  if (takeThese.size || giveThese.size) membersWithRoles.push(member);
 });

 Jobs.scheduleJob('*/1 * * * * *', () => {
  parentPort?.postMessage(membersWithRoles);
 });
};

const handleConstant = (
 obj: PassObject,
 row: Serialized<Prisma.roleseparator>,
 sep: Role,
 memberRoleIds: Set<string>,
 giveThese: Set<string>,
 takeThese: Set<string>,
) => {
 const hasRole = row.roles?.some((role) => memberRoleIds.has(role));

 if (hasRole && !memberRoleIds.has(sep.id) && obj.clientHighestRole.position > sep.position) {
  giveThese.add(sep.id);
 } else if (
  !hasRole &&
  memberRoleIds.has(sep.id) &&
  obj.clientHighestRole.position > sep.position
 ) {
  takeThese.add(sep.id);
 }
};

const handleDynamic = (
 obj: PassObject,
 row: Serialized<Prisma.roleseparator>,
 sep: Role,
 memberRoleIds: Set<string>,
 giveThese: Set<string>,
 takeThese: Set<string>,
) => {
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
  giveThese.add(sep.id);
 } else if (
  !hasRole &&
  memberRoleIds.has(sep.id) &&
  obj.clientHighestRole.position > sep.position
 ) {
  takeThese.add(sep.id);
 }
};

start(workerData);

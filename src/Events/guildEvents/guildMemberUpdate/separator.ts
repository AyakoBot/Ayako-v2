// eslint-disable-next-line no-shadow
import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import { Worker } from 'worker_threads';
import client from '../../../BaseClient/Client.js';
import * as Typings from '../../../Typings/Typings.js';

export const separatorAssigner: Map<string, Jobs.Job[]> = new Map();
const UpdateWorker = new Worker(
 `${process.cwd()}${
  process.cwd().includes('dist') ? '' : '/dist'
 }/Events/guildEvents/guildMemberUpdate/separatorUpdater.js`,
);

UpdateWorker.on(
 'message',
 async ([text, userData, roleData]: [
  text: string,
  userDate: { userid: string; guildid: string } | undefined,
  roleData: string[],
 ]) => {
  switch (text) {
   case 'NO_SEP': {
    client.util.DataBase.roleseparator
     .updateMany({
      where: { separator: roleData[0] },
      data: { active: false },
     })
     .then();
    break;
   }
   case 'TAKE': {
    if (!userData) return;
    const guild = client.guilds.cache.get(userData.guildid);
    if (!guild) return;
    const member = guild.members.cache.get(userData.userid);
    if (!member) return;
    const language = await client.util.getLanguage(guild.id);

    client.util.roleManager.remove(member, roleData, language.autotypes.separators);
    break;
   }
   case 'GIVE': {
    if (!userData) return;
    const guild = client.guilds.cache.get(userData.guildid);
    if (!guild) return;
    const member = guild.members.cache.get(userData.userid);
    if (!member) return;
    const language = await client.util.getLanguage(guild.id);

    client.util.roleManager.add(member, roleData, language.autotypes.separators);
    break;
   }
   default: {
    break;
   }
  }
 },
);
UpdateWorker.on('error', (error) => {
 throw error;
});

const isWaiting = new Set();

export default (member: Discord.GuildMember, oldMember: Discord.GuildMember) => {
 if (
  oldMember.roles.cache
   .sort((a, b) => a.position - b.position)
   .map((k) => k.id)
   .join(' ') ===
  member.roles.cache
   .sort((a, b) => a.position - b.position)
   .map((k) => k.id)
   .join(' ')
 ) {
  return;
 }

 if (isWaiting.has(`${member.id}-${member.guild.id}`)) return;
 isWaiting.add(`${member.id}-${member.guild.id}`);

 Jobs.scheduleJob(new Date(Date.now() + 5000), async () => {
  isWaiting.delete(`${member.id}-${member.guild.id}`);

  const stillrunning = await client.util.DataBase.roleseparatorsettings.findFirst({
   where: { guildid: member.guild.id, stillrunning: true },
  });
  if (stillrunning) return;

  const rows = await client.util.DataBase.roleseparator.findMany({
   where: { active: true, guildid: member.guild.id },
  });
  if (!rows) return;

  const map = new Map<string, { position: number; id: string }>();
  member.guild.roles.cache
   .map((r) => r)
   .forEach((r) => map.set(r.id, { position: r.position, id: r.id }));

  UpdateWorker.postMessage({
   roles: member.roles.cache.map((r) => r.id),
   guildid: member.guild.id,
   userid: member.user.id,
   guildroles: map,
   highest: { id: member.guild.roles.highest.id, position: member.guild.roles.highest.position },
   res: rows.map((r) => ({ ...r, uniquetimestamp: Number(r.uniquetimestamp) })),
  });
 });
};

export const oneTimeRunner = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'> | undefined,
 guild: Discord.Guild,
 lastRun: boolean = false,
) => {
 const language = await client.util.getLanguage(guild.id);

 const rows = await client.util.DataBase.roleseparator.findMany({
  where: { active: true, guildid: guild.id },
 });
 if (!rows) return;

 const settings =
  (await client.util.DataBase.roleseparatorsettings.findUnique({
   where: { guildid: guild.id },
  })) ??
  (await client.util.DataBase.roleseparatorsettings.create({
   data: { guildid: guild.id, stillrunning: false },
  }));
 if (!settings) return;

 if (settings.stillrunning && cmd) {
  cmd.reply({
   embeds: [
    {
     description: language.slashCommands.settings.categories.separators.oneTimeRunner.stillrunning,
    },
   ],
  });
  return;
 }

 client.util.DataBase.roleseparatorsettings
  .update({
   where: { guildid: guild.id },
   data: { stillrunning: true },
  })
  .then();

 await cmd?.deferReply({ fetchReply: true, ephemeral: true });

 const members = await getMembers(guild, rows);

 const finishTime = Math.floor(
  Date.now() / 1000 +
   (members ? members.length * 4 : 0) +
   ((members ? members.length : 0) / 3600) * 400,
 );

 cmd?.editReply({
  embeds: [
   {
    author: {
     name: language.slashCommands.settings.authorType(
      language.slashCommands.settings.categories.separators.name,
     ),
     icon_url: client.util.emotes.settings.link,
    },
    description: language.slashCommands.settings.categories.separators.oneTimeRunner.stats(
     members && members.length ? members.length : 0,
     members && members.length ? members.length * 4 : 0,
     `<t:${finishTime}:F> (<t:${finishTime}:R>)`,
    ),
   },
  ],
 });

 client.util.DataBase.roleseparatorsettings
  .update({
   where: {
    guildid: guild.id,
   },
   data: {
    stillrunning: true,
    duration: members.length * 4,
    startat: Date.now(),
   },
  })
  .then();

 assinger(guild, members, lastRun);
};

type PassObject = {
 members: { id: string; roles: { id: string; position: number }[] }[];
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

const getMembers = async (
 guild: Discord.Guild,
 rows: Prisma.roleseparator[],
): Promise<
 {
  id: string;
  roles: {
   id: string;
   position: number;
  }[];
  giveTheseRoles: string[];
  takeTheseRoles: string[];
 }[]
> => {
 const highestRole = guild.roles.cache.map((o) => o).sort((a, b) => b.position - a.position)[0];
 const clientHighestRole = (await client.util.getBotMemberFromGuild(guild))?.roles.highest;

 const obj: PassObject = {
  members: [],
  separators: [],
  rowroles: [],
  roles: [],
  highestRole: {
   id: highestRole.id,
   position: highestRole.position,
  },
  clientHighestRole: {
   id: clientHighestRole.id,
   position: clientHighestRole.position,
  },
 };

 guild.members.cache.forEach((member) => {
  const roles: { id: string; position: number }[] = [];

  member.roles.cache.forEach((r) => {
   const role = guild.roles.cache.get(r.id);
   if (!role) return;

   roles.push({ id: role.id, position: role.position });
  });

  obj.members.push({ id: member.user.id, roles });
 });

 guild.roles.cache.forEach((role) => {
  obj.roles.push({ id: role.id, position: role.position });
 });

 rows.forEach((r) => {
  if (!r.separator) return;

  const separator = guild.roles.cache.get(r.separator);
  if (!separator) return;

  if (r.stoprole) {
   const stoprole = guild.roles.cache.get(r.stoprole);
   if (!stoprole) return;

   obj.separators.push({
    separator: {
     id: r.separator,
     position: separator.position,
    },
    stoprole: { id: r.stoprole, position: stoprole.position },
   });
  } else {
   obj.separators.push({
    separator: {
     id: r.separator,
     position: separator.position,
    },
   });
  }

  if (r.roles && r.roles.length) {
   obj.roles.forEach((objRole) => {
    const role = guild.roles.cache.get(objRole.id);
    if (!role) return;

    obj.rowroles.push({ id: role.id, position: role.position });
   });
  }
 });

 const worker = new Worker('./dist/Events/guildEvents/guildMemberUpdate/separatorWorker.js', {
  workerData: {
   res: rows.map((r) => ({ ...r, uniquetimestamp: Number(r.uniquetimestamp) })),
   obj,
  },
 });

 const members = (await new Promise((resolve, reject) => {
  worker.once('message', (result) => {
   resolve(result);
   worker.terminate();
  });
  worker.once('error', (error) => {
   reject();
   worker.terminate();
   throw error;
  });
 })) as Typings.DePromisify<ReturnType<typeof getMembers>>;

 members.forEach((fakeMember) => {
  const realMember = guild?.members.cache.get(fakeMember.id);
  if (!realMember) return;

  fakeMember.giveTheseRoles
   .filter((r) => realMember.roles.cache.has(r))
   .forEach((_, i) => fakeMember.giveTheseRoles.splice(i, 1));

  fakeMember.takeTheseRoles
   .filter((r) => !realMember.roles.cache.has(r))
   .forEach((_, i) => fakeMember.takeTheseRoles.splice(i, 1));
 });

 return members;
};

const assinger = async (
 guild: Discord.Guild,
 membersWithRoles: Typings.DePromisify<ReturnType<typeof getMembers>>,
 lastRun: boolean = false,
) => {
 if (!guild) return;
 const language = await client.util.getLanguage(guild.id);

 if (!membersWithRoles?.length) {
  client.util.DataBase.roleseparatorsettings
   .update({
    where: { guildid: guild.id },
    data: { stillrunning: false, duration: null, startat: null },
   })
   .then();

  return;
 }

 if (!separatorAssigner.get(guild.id)) separatorAssigner.set(guild.id, []);

 const thisMap = separatorAssigner.get(guild.id);
 if (!thisMap) return;

 membersWithRoles.forEach((raw, index) => {
  thisMap.push(
   Jobs.scheduleJob(new Date(Date.now() + index * 3000), async () => {
    const member = guild.members.cache.get(raw.id);

    if (member) {
     client.util.roleManager.add(member, raw.giveTheseRoles, language.autotypes.separators, 2);
     client.util.roleManager.remove(member, raw.takeTheseRoles, language.autotypes.separators, 2);
    }

    if (index === membersWithRoles.length - 1 && lastRun) {
     client.util.DataBase.roleseparatorsettings
      .update({
       where: { guildid: guild.id },
       data: { stillrunning: false, duration: null, startat: null },
      })
      .then();

     return;
    }

    if (index === membersWithRoles.length - 1) {
     oneTimeRunner(undefined, guild, true);
     return;
    }

    client.util.DataBase.roleseparatorsettings
     .update({
      where: { guildid: guild.id },
      data: { index, length: membersWithRoles.length - 1 },
     })
     .then();
   }),
  );
 });
};

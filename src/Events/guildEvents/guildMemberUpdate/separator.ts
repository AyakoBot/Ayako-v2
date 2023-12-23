// eslint-disable-next-line no-shadow
import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import { Worker } from 'worker_threads';
import client from '../../../BaseClient/Client.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

const UpdateWorker = new Worker(
 `${process.cwd()}/Events/guildEvents/guildMemberUpdate/separatorUpdater.js`,
);
export const separatorAssigner: Map<string, Jobs.Job[]> = new Map();

UpdateWorker.on(
 'message',
 async ([text, userData, roleData]: [
  text: string,
  userDate: { userid: string; guildid: string } | undefined,
  roleData: string[],
 ]) => {
  switch (text) {
   case 'NO_SEP': {
    ch.DataBase.roleseparator
     .updateMany({
      where: {
       separator: roleData[0],
      },
      data: {
       active: false,
      },
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
    const language = await ch.getLanguage(guild.id);

    ch.roleManager.remove(member, roleData, language.autotypes.separators);
    break;
   }
   case 'GIVE': {
    if (!userData) return;
    const guild = client.guilds.cache.get(userData.guildid);
    if (!guild) return;
    const member = guild.members.cache.get(userData.userid);
    if (!member) return;
    const language = await ch.getLanguage(guild.id);

    ch.roleManager.add(member, roleData, language.autotypes.separators);
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
  'roles' in oldMember &&
  oldMember.roles.cache
   .sort((a, b) => a.position - b.position)
   .map((k) => k)
   .join(' ') ===
   member.roles.cache
    .sort((a, b) => a.position - b.position)
    .map((k) => k)
    .join(' ')
 ) {
  return;
 }

 if (isWaiting.has(`${member.id}-${member.guild.id}`)) return;
 isWaiting.add(`${member.id}-${member.guild.id}`);

 Jobs.scheduleJob(new Date(Date.now() + 2000), async () => {
  isWaiting.delete(`${member.id}-${member.guild.id}`);

  const stillrunning = await ch.DataBase.roleseparatorsettings.findFirst({
   where: {
    guildid: member.guild.id,
   },
  });
  if (stillrunning) return;

  const roleseparatorRows = await ch.DataBase.roleseparator.findFirst({
   where: {
    active: true,
    guildid: member.guild.id,
   },
  });
  if (!roleseparatorRows) return;

  const map = new Map();
  member.guild.roles.cache.map((r) => r).forEach((r) => map.set(r.id, r));

  UpdateWorker.postMessage({
   roles: member.roles,
   guildid: member.guild.id,
   userid: member.user.id,
   guildroles: map,
   highest: member.guild.roles.cache.map((r) => r).sort((a, b) => b.position - a.position)[0],
   res: roleseparatorRows,
   language: await ch.getLanguage(member.guild.id),
  });
 });
};

export const oneTimeRunner = async (
 m:
  | Discord.Message<true>
  | {
     id: string | undefined | null;
     guild: Discord.Guild;
     author: Discord.User;
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel
      | Discord.VoiceChannel
      | Discord.StageChannel
      | undefined;
    },
 embed: Discord.APIEmbed,
 button?: Discord.ButtonInteraction,
 lastTime?: boolean,
) => {
 if (!m.guild) return;
 const language = await ch.getLanguage(m.guild.id);

 const roleseparatorRows = await ch.DataBase.roleseparator.findMany({
  where: {
   active: true,
   guildid: m.guild.id,
  },
 });
 if (!roleseparatorRows) return;

 let membersWithRoles:
  | boolean
  | {
     id: string;
     roles: { id: string; position: number }[];
     giveTheseRoles: string[];
     takeTheseRoles: string[];
    }[]
  | undefined;

 if (
  (await ch.DataBase.roleseparatorsettings
   .findFirst({
    where: {
     guildid: m.guild.id,
    },
   })
   .then((r) => r?.stillrunning)) &&
  m.author.id !== client.user?.id
 ) {
  membersWithRoles = true;
 } else {
  ch.DataBase.roleseparatorsettings
   .update({
    where: {
     guildid: m.guild.id,
    },
    data: {
     stillrunning: true,
    },
   })
   .then();
  membersWithRoles = await getMembers(m.guild, roleseparatorRows);
 }

 embed.author = {
  name: language.slashCommands.settings.authorType(
   language.slashCommands.settings.categories.separators.name,
  ),
  icon_url: ch.emotes.settings.link,
  url: ch.constants.standard.invite,
 };

 if (button) await button.deleteReply().catch(() => undefined);

 if (!Array.isArray(membersWithRoles)) {
  if (!membersWithRoles) {
   embed.description = language.slashCommands.settings.categories.separators.oneTimeRunner.finished;

   if (m instanceof Discord.Message) {
    ch.request.channels.editMsg(m, { embeds: [embed], components: [] });
   }
  } else {
   embed.description =
    language.slashCommands.settings.categories.separators.oneTimeRunner.stillrunning;

   if (m instanceof Discord.Message) {
    ch.request.channels.editMsg(m, { embeds: [embed], components: [] });
   }
  }
 } else {
  membersWithRoles.forEach((mem) => {
   const fakeMember = mem;
   const realMember = m.guild?.members.cache.get(mem.id);

   if (realMember) {
    if (fakeMember.giveTheseRoles) {
     fakeMember.giveTheseRoles.forEach((roleID, rindex) => {
      if (realMember.roles.cache.has(roleID)) {
       mem.giveTheseRoles.splice(rindex, 1);
      }
     });
    }
    if (fakeMember.takeTheseRoles) {
     fakeMember.takeTheseRoles.forEach((roleID, rindex) => {
      if (!realMember.roles.cache.has(roleID)) {
       mem.takeTheseRoles.splice(rindex, 1);
      }
     });
    }
   }
  });
  const finishTime = Math.floor(
   Date.now() / 1000 +
    (membersWithRoles ? membersWithRoles.length * 4 : 0) +
    ((membersWithRoles ? membersWithRoles.length : 0) / 3600) * 400,
  );

  embed.author = {
   name: language.slashCommands.settings.authorType(
    language.slashCommands.settings.categories.separators.name,
   ),
   icon_url: ch.emotes.settings.link,
   url: ch.constants.standard.invite,
  };
  embed.description = language.slashCommands.settings.categories.separators.oneTimeRunner.stats(
   membersWithRoles && membersWithRoles.length ? membersWithRoles.length : 0,
   membersWithRoles && membersWithRoles.length ? membersWithRoles.length * 4 : 0,
   `<t:${finishTime}:F> (<t:${finishTime}:R>)`,
  );

  if (m instanceof Discord.Message) {
   ch.request.channels.editMsg(m, { embeds: [embed], components: [] });
  }

  ch.DataBase.roleseparatorsettings
   .update({
    where: {
     guildid: m.guild.id,
    },
    data: {
     stillrunning: true,
     duration: membersWithRoles.length * 4,
     startat: Date.now(),
     channelid: m.channel?.id,
     messageid: m.id,
    },
   })
   .then();

  assinger(m, membersWithRoles, embed, lastTime);
 }
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
 roleseparatorRows: Prisma.roleseparator[],
): Promise<
 | {
    id: string;
    roles: {
     id: string;
     position: number;
    }[];
    giveTheseRoles: string[];
    takeTheseRoles: string[];
   }[]
 | undefined
> => {
 const highestRole = guild.roles.cache.map((o) => o).sort((a, b) => b.position - a.position)[0];
 const clientHighestRole = (await ch.getBotMemberFromGuild(guild))?.roles.highest;
 if (!clientHighestRole) return undefined;

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

 roleseparatorRows.forEach((r) => {
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
  workerData: { res: roleseparatorRows, obj },
 });

 return new Promise((resolve, reject) => {
  worker.once('message', (result) => {
   resolve(result);
   worker.terminate();
  });
  worker.once('error', (error) => {
   reject();
   throw error;
  });
 });
};

const assinger = async (
 msg:
  | Discord.Message<true>
  | {
     id: string | undefined | null;
     guild: Discord.Guild;
     author: Discord.User;
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel
      | Discord.VoiceChannel
      | Discord.StageChannel
      | undefined;
    },
 membersWithRoles: {
  id: string;
  roles: {
   id: string;
   position: number;
  }[];
  giveTheseRoles: string[];
  takeTheseRoles: string[];
 }[],
 embed: Discord.APIEmbed,
 lastTime?: boolean,
) => {
 if (!msg.guild) return;
 const language = await ch.getLanguage(msg.guild.id);

 if (!membersWithRoles?.length) {
  embed.author = {
   name: language.slashCommands.settings.authorType(
    language.slashCommands.settings.categories.separators.name,
   ),
   icon_url: ch.emotes.settings.link,
   url: ch.constants.standard.invite,
  };

  embed.description = language.slashCommands.settings.categories.separators.oneTimeRunner.finished;
  if (msg instanceof Discord.Message) {
   ch.request.channels.editMsg(msg, { embeds: [embed], components: [] });
  }

  ch.DataBase.roleseparatorsettings
   .update({
    where: {
     guildid: msg.guild.id,
    },
    data: {
     stillrunning: false,
     duration: null,
     startat: null,
    },
   })
   .then();

  return;
 }

 if (!separatorAssigner.get(msg.guild.id)) separatorAssigner.set(msg.guild.id, []);
 const thisMap = separatorAssigner.get(msg.guild.id);
 if (!thisMap) return;

 membersWithRoles.forEach((raw, index) => {
  thisMap.push(
   Jobs.scheduleJob(new Date(Date.now() + index * 3000), async () => {
    const member = msg.guild?.members.cache.get(raw.id);

    if (member) {
     ch.roleManager.add(member, raw.giveTheseRoles, language.autotypes.separators, 2);
     ch.roleManager.remove(member, raw.takeTheseRoles, language.autotypes.separators, 2);
    }

    if (index === membersWithRoles.length - 1 && lastTime) {
     embed.author = {
      name: language.slashCommands.settings.authorType(
       language.slashCommands.settings.categories.separators.name,
      ),
      icon_url: ch.emotes.settings.link,
      url: ch.constants.standard.invite,
     };
     embed.description =
      language.slashCommands.settings.categories.separators.oneTimeRunner.finished;

     if (msg instanceof Discord.Message) {
      ch.request.channels.editMsg(msg, { embeds: [embed], components: [] });
     }

     ch.DataBase.roleseparatorsettings
      .update({
       where: {
        guildid: msg.guild?.id,
       },
       data: {
        stillrunning: false,
        duration: null,
        startat: null,
       },
      })
      .then();

     return;
    }

    if (index === membersWithRoles.length - 1) {
     oneTimeRunner(msg, embed, undefined, true);
     return;
    }

    ch.DataBase.roleseparatorsettings
     .update({
      where: {
       guildid: msg.guild?.id,
      },
      data: {
       index,
       length: membersWithRoles.length - 1,
      },
     })
     .then();
   }),
  );
 });
};

// eslint-disable-next-line no-shadow
import { Worker } from 'worker_threads';
import jobs from 'node-schedule';
import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';

const UpdateWorker = new Worker(
  `${process.cwd()}/Events/guildEvents/guildMemberUpdate/separatorUpdater.js`,
);
export const separatorAssigner: Map<string, jobs.Job[]> = new Map();

UpdateWorker.on(
  'message',
  async ([text, userData, roleData]: [
    text: string,
    userDate: { userid: string; guildid: string } | undefined,
    roleData: string[],
  ]) => {
    switch (text) {
      case 'NO_SEP': {
        client.ch.query('UPDATE roleseparator SET active = false WHERE separator = $1;', [
          roleData[0],
        ]);
        break;
      }
      case 'TAKE': {
        if (!userData) return;
        const guild = client.guilds.cache.get(userData.guildid);
        if (!guild) return;
        const member = guild.members.cache.get(userData.userid);
        if (!member) return;
        const language = await client.ch.languageSelector(guild.id);

        client.ch.roleManager.remove(member, roleData, language.autotypes.separators);
        break;
      }
      case 'GIVE': {
        if (!userData) return;
        const guild = client.guilds.cache.get(userData.guildid);
        if (!guild) return;
        const member = guild.members.cache.get(userData.userid);
        if (!member) return;
        const language = await client.ch.languageSelector(guild.id);

        client.ch.roleManager.add(member, roleData, language.autotypes.separators);
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

  jobs.scheduleJob(new Date(Date.now() + 2000), async () => {
    isWaiting.delete(`${member.id}-${member.guild.id}`);

    const stillrunning = await client.ch
      .query('SELECT stillrunning FROM roleseparatorsettings WHERE guildid = $1;', [
        member.guild.id,
      ])
      .then((r: DBT.roleseparatorsettings[] | null) => (r ? r[0].stillrunning : null));
    if (stillrunning) return;

    const roleseparatorRows = await client.ch
      .query('SELECT * FROM roleseparator WHERE active = true AND guildid = $1;', [member.guild.id])
      .then((r: DBT.roleseparator[] | null) => r || null);
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
      language: await client.ch.languageSelector(member.guild.id),
    });
  });
};

export const oneTimeRunner = async (
  msg:
    | Discord.Message
    | {
        guild: Discord.Guild;
        author: Discord.User;
        channel:
          | Discord.NewsChannel
          | Discord.TextChannel
          | Discord.PrivateThreadChannel
          | Discord.PublicThreadChannel
          | Discord.VoiceChannel;
      },
  m: Discord.Message,
  embed: Discord.APIEmbed,
  button?: Discord.ButtonInteraction,
  lastTime?: boolean,
) => {
  if (!msg.guild) return;
  const language = await client.ch.languageSelector(msg.guild.id);

  const roleseparatorRows = await client.ch
    .query('SELECT * FROM roleseparator WHERE active = true AND guildid = $1;', [msg.guild.id])
    .then((r: DBT.roleseparator[] | null) => r || undefined);
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
    (await client.ch
      .query('SELECT stillrunning FROM roleseparatorsettings WHERE guildid = $1;', [msg.guild.id])
      .then((r: DBT.roleseparatorsettings[] | null) => (r ? r[0].stillrunning : undefined))) &&
    msg.author.id !== client.user?.id
  ) {
    membersWithRoles = true;
  } else {
    client.ch.query('UPDATE roleseparatorsettings SET stillrunning = $2 WHERE guildid = $1;', [
      msg.guild.id,
      true,
    ]);
    membersWithRoles = await getMembers(msg.guild, roleseparatorRows);
  }

  embed.author = {
    name: language.slashCommands.settings.authorType(
      language.slashCommands.settings.categories.separators.name,
    ),
    icon_url: client.objectEmotes.settings.link,
    url: client.customConstants.standard.invite,
  };

  if (button) await button.deleteReply().catch(() => undefined);

  if (!Array.isArray(membersWithRoles)) {
    if (!membersWithRoles) {
      embed.description =
        language.slashCommands.settings.categories.separators.oneTimeRunner.finished;

      m.edit({ embeds: [embed], components: [] }).catch(() => undefined);
    } else {
      embed.description =
        language.slashCommands.settings.categories.separators.oneTimeRunner.stillrunning;

      m.edit({ embeds: [embed], components: [] }).catch(() => undefined);
    }
  } else {
    membersWithRoles.forEach((mem) => {
      const fakeMember = mem;
      const realMember = msg.guild?.members.cache.get(m.id);

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
      icon_url: client.objectEmotes.settings.link,
      url: client.customConstants.standard.invite,
    };
    embed.description = language.slashCommands.settings.categories.separators.oneTimeRunner.stats(
      membersWithRoles && membersWithRoles.length ? membersWithRoles.length : 0,
      membersWithRoles && membersWithRoles.length ? membersWithRoles.length * 4 : 0,
      `<t:${finishTime}:F> (<t:${finishTime}:R>)`,
    );

    m.edit({ embeds: [embed], components: [] }).catch(() => undefined);
    client.ch.query(
      'UPDATE roleseparatorsettings SET stillrunning = $1, duration = $3, startat = $4, channelid = $5, messageid = $6 WHERE guildid = $2;',
      [
        true,
        msg.guild.id,
        Math.floor(Date.now() / 1000) + membersWithRoles.length * 4,
        Date.now(),
        msg.channel.id,
        m.id,
      ],
    );
    assinger(msg, m, membersWithRoles, embed, lastTime);
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
  roleseparatorRows: DBT.roleseparator[],
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
  await guild.members.fetch().catch(() => undefined);

  const highestRole = guild.roles.cache.map((o) => o).sort((a, b) => b.position - a.position)[0];
  const clientHighestRole = guild.members.me?.roles.highest;
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
    | Discord.Message
    | {
        guild: Discord.Guild;
        author: Discord.User;
        channel:
          | Discord.NewsChannel
          | Discord.TextChannel
          | Discord.PrivateThreadChannel
          | Discord.PublicThreadChannel
          | Discord.VoiceChannel;
      },
  m: Discord.Message,
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
  const language = await client.ch.languageSelector(msg.guild.id);

  if (!membersWithRoles?.length) {
    embed.author = {
      name: language.slashCommands.settings.authorType(
        language.slashCommands.settings.categories.separators.name,
      ),
      icon_url: client.objectEmotes.settings.link,
      url: client.customConstants.standard.invite,
    };

    embed.description =
      language.slashCommands.settings.categories.separators.oneTimeRunner.finished;
    m.edit({ embeds: [embed], components: [] }).catch(() => undefined);
    client.ch.query(
      'UPDATE roleseparatorsettings SET stillrunning = $1, duration = $3, startat = $4 WHERE guildid = $2;',
      [false, msg.guild.id, null, null],
    );

    return;
  }

  if (!separatorAssigner.get(msg.guild.id)) separatorAssigner.set(msg.guild.id, []);
  const thisMap = separatorAssigner.get(msg.guild.id);
  if (!thisMap) return;

  membersWithRoles.forEach((raw, index) => {
    thisMap.push(
      jobs.scheduleJob(new Date(Date.now() + index * 3000), async () => {
        const member = msg.guild?.members.cache.get(raw.id);

        if (member) {
          client.ch.roleManager.add(member, raw.giveTheseRoles, language.autotypes.separators, 2);
          client.ch.roleManager.remove(
            member,
            raw.takeTheseRoles,
            language.autotypes.separators,
            2,
          );
        }

        if (index === membersWithRoles.length - 1 && lastTime) {
          embed.author = {
            name: language.slashCommands.settings.authorType(
              language.slashCommands.settings.categories.separators.name,
            ),
            icon_url: client.objectEmotes.settings.link,
            url: client.customConstants.standard.invite,
          };
          embed.description =
            language.slashCommands.settings.categories.separators.oneTimeRunner.finished;

          m.edit({ embeds: [embed], components: [] }).catch(() => undefined);
          client.ch.query(
            'UPDATE roleseparatorsettings SET stillrunning = $1, duration = $3, startat = $4 WHERE guildid = $2;',
            [false, msg.guild?.id, undefined, undefined],
          );

          return;
        }

        if (index === membersWithRoles.length - 1) {
          oneTimeRunner(msg, m, embed, undefined, true);
          return;
        }

        client.ch.query(
          'UPDATE roleseparatorsettings SET index = $1, length = $3 WHERE guildid = $2;',
          [index, msg.guild?.id, membersWithRoles.length - 1],
        );
      }),
    );
  });
};

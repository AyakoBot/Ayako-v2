import type * as Discord from 'discord.js';
import { glob } from 'glob';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
  const settingName = args.shift();
  if (!settingName) return;

  const tableName =
    ch.constants.commands.settings.tableNames[
      settingName as keyof typeof ch.constants.commands.settings.tableNames
    ];
  const uniquetimestamp = Number(args.shift());

  const currentSetting = await (uniquetimestamp
    ? ch.query(`SELECT active FROM ${tableName} WHERE uniquetimestamp = $1;`, [uniquetimestamp])
    : ch.query(`SELECT active FROM ${tableName} WHERE guildid = $1;`, [cmd.guildId])
  ).then((r: { active: boolean }[] | null) => {
    if (!r) {
      if (uniquetimestamp) {
        return ch
          .query(
            `INSERT INTO ${tableName} (guildid, uniquetimestamp) VALUES ($1) RETURNING active;`,
            [cmd.guildId, Date.now()],
          )
          .then((r: { active: boolean }[] | null) => (r ? r[0] : null));
      } else {
        return ch
          .query(`INSERT INTO ${tableName} (guildid) VALUES ($1) RETURNING active;`, [cmd.guildId])
          .then((r: { active: boolean }[] | null) => (r ? r[0] : null));
      }
    }

    return r ? r[0] : null;
  });

  const newActive = !!currentSetting?.active;

  const updatedSetting = uniquetimestamp
    ? ch
        .query(`UPDATE ${tableName} SET active = $1 WHERE uniquetimestamp = $2 RETURNING active;`, [
          uniquetimestamp,
        ])
        .then((r: { active: boolean }[] | null) => (r ? r[0] : null))
    : ch
        .query(`UPDATE ${tableName} SET active = $1 WHERE guildid = $2 RETURNING active;`, [
          newActive,
          cmd.guildId,
        ])
        .then((r: { active: boolean }[] | null) => (r ? r[0] : null));

  ch.settingsHelpers.updateLog(
    currentSetting,
    updatedSetting,
    'active',
    settingName,
    uniquetimestamp,
  );

  const files: string[] = await new Promise((resolve) => {
    glob(`${process.cwd()}/Commands/SlashCommands/settings/**/*`, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });

  const file = files.find((f) => f.endsWith(`/${settingName}.js`));
  if (!file) return;

  const settingsFile = await import(file);
};

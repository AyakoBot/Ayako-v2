import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
  const settings = (
    await ch
      .query(
        `SELECT * FROM ${ch.constants.commands.settings.tableNames['anti-virus-punishments']} WHERE guildid = $1 AND type = $2;`,
        [cmd.guildId, 'anti-virus'],
      )
      .then((r: DBT.punishments[] | null) => r)
  )?.filter((s) => {
    const id = cmd.isAutocomplete() ? String(cmd.options.get('id', false)?.value) : '';

    return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
  });

  const language = await ch.languageSelector(cmd.guildId);
  const lan = language.slashCommands.settings.categories['anti-virus-punishments'];

  if (!settings) return [];

  return settings?.map((s) => ({
    name: `${lan.fields.warnamount.name}: ${s.warnamount ?? language.None} - ${
      lan.fields.punishment.name
    }: ${
      s.punishment
        ? language.punishments[s.punishment as keyof typeof language.punishments]
        : language.None
    }`,
    value: Number(s.uniquetimestamp).toString(36),
  }));
};

export default f;

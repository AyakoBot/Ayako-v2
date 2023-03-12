import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
  const settings = (
    await ch
      .query(
        `SELECT * FROM ${ch.constants.commands.settings.tableNames['cooldowns']} WHERE guildid = $1;`,
        [cmd.guildId],
      )
      .then((r: DBT.cooldowns[] | null) => r)
  )?.filter((s) => {
    const id = cmd.isAutocomplete() ? String(cmd.options.get('id', false)?.value) : '';

    return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
  });

  const language = await ch.languageSelector(cmd.guildId);
  const lan = language.slashCommands.settings.categories['cooldowns'];

  if (!settings) return [];

  return settings?.map((s) => ({
    name: `${lan.fields.command.name}: \`${s.command ?? language.None}\` - ${
      lan.fields.cooldown
    }: ${ch.settingsHelpers.embedParsers.time(Number(s.cooldown), language)}`,
    value: Number(s.uniquetimestamp).toString(36),
  }));
};

export default f;

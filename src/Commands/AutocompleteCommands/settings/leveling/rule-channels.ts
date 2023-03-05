import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.AutocompleteInteraction) => {
  const settings = (
    await ch
      .query(
        `SELECT * FROM ${ch.constants.commands.settings.tableNames['rule-channels']} WHERE guildid = $1;`,
        [cmd.guildId],
      )
      .then((r: DBT.levelingruleschannels[] | null) => r)
  )?.filter((s) => {
    const id = String(cmd.options.get('id', false)?.value);

    return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
  });

  const language = await ch.languageSelector(cmd.guildId);

  if (!settings) {
    cmd.respond([]);
    return;
  }

  cmd.respond(
    settings?.map((s) => ({
      name: `${ch.channelRuleCalc(Number(s.rules), language)} ${language.ChannelRules} - ${Number(
        s.channels?.length,
      )} ${language.Channels}`,
      value: Number(s.uniquetimestamp).toString(36),
    })),
  );
};

import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.AutocompleteInteraction) => {
  const value = cmd.options.get('user-name', false)?.value as string;
  if (value?.length < 3) return;

  const possibleUsers = await ch.findUserByName(value);

  cmd.respond(
    [...new Set(possibleUsers.map((u) => u.id))]
      .map((id) => ({
        name: possibleUsers.find((u) => u.id === id)?.username ?? '-',
        value: id,
      }))
      .splice(0, 25),
  );
};

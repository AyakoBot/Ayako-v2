import commands from '../../../Commands/SlashCommands/SlashCommands.js';
import { client } from '../../../BaseClient/Client.js';

export default async () => {
  await client.application?.commands.fetch();

  Object.entries(commands.public).forEach(([commandName, command]) => {
    const exists = client.application?.commands.cache.find((c) => c.name === commandName);

    if (exists) client.application?.commands.edit(exists, command);
    else client.application?.commands.create(command);
  });

  client.application?.commands.cache.forEach((command) => {
    const exists = Object.keys(commands.public).find((commandName) => command.name === commandName);

    if (!exists) client.application?.commands.delete(command.id);
  });
};

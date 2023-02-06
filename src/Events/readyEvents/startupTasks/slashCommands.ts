import commands from '../../../Commands/SlashCommands/SlashCommands.js';
import client from '../../../BaseClient/Client.js';

export default () => {
  Object.entries(commands.public).forEach(([commandName, command]) => {
    const exists = client.application?.commands.cache.find((c) => c.name === commandName);
    if (exists) {
      client.application?.commands.edit(exists, command);
      return;
    }

    client.application?.commands.create(command);
  });
};

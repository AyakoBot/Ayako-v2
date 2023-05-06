import commands from '../../../Commands/SlashCommands/SlashCommands.js';
import client from '../../../BaseClient/Client.js';

export default async () => {
 await client.application?.commands.fetch();

 Object.values(commands.public).forEach((command) => {
  const exists = client.application?.commands.cache.find((c) => c.name === command.name);

  if (exists) client.application?.commands.edit(exists, command);
  else client.application?.commands.create(command);
 });

 client.application?.commands.cache.forEach((command) => {
  const exists = Object.values(commands.public).find((c) => command.name === c.name);

  if (!exists) client.application?.commands.delete(command.id);
 });
};

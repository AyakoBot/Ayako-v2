import commands from './SlashCommands.js';
import client from '../../../BaseClient/Client.js';

export default async () => {
 if (client.shard?.mode !== 'process') return;

 const createCommands = Object.values(commands.public);
 await client.application?.commands.set(createCommands);

 await client.application?.commands.fetch();
};

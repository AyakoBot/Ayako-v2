import commands from './SlashCommands.js';
import client from '../../../BaseClient/Client.js';

export default async () => {
 const createCommands = Object.values(commands.public);
 client.application?.commands.set(createCommands);
};

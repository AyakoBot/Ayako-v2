import client from '../../../../BaseClient/Bot/Client.js';

export default async () => {
 client.util.importCache.Events.BotEvents.readyEvents.timedFiles.expiry.file.default();
 client.util.importCache.Events.BotEvents.readyEvents.timedFiles.stats.file.default();
 client.util.importCache.Events.BotEvents.readyEvents.timedFiles.separators.file.default();
};

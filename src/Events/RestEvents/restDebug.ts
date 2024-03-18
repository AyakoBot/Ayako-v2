import client from '../../BaseClient/Bot/Client.js';
import { getDebugInfo } from '../../BaseClient/UtilModules/console.js';

export default async (info: string) => {
 client.util.logFiles.ratelimits.write(`${getDebugInfo()} [Rest Debug] ${info}\n`);
};

import Util from '../../BaseClient/Bot/Util.js';

export default (error: string) => {
 // eslint-disable-next-line no-console
 console.error(error);
 Util.logFiles.console.write(`${error}\n`);
};

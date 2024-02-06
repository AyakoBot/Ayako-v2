import log from '../../BaseClient/Other/logFiles.js';

export default (error: string) => {
 // eslint-disable-next-line no-console
 console.error(error);
 log.console.write(`${error}\n`);
};

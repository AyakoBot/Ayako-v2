const { log } = console;

const warnEnabled = process.argv.includes('--warn');

export default (message: string) => {
 if (!warnEnabled) return;
 log(message);
};

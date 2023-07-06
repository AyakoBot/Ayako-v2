const { log } = console;

const debugEnabled = process.argv.includes('--debug');

export default (message: string) => {
 if (message.includes('Heartbeat')) return;
 if (!debugEnabled) return;
 log(message);
};

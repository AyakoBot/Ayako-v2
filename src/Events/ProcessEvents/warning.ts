export default (warning: Error) => {
 // eslint-disable-next-line no-console
 console.log(`[Warning] ${warning.message}`);
 // eslint-disable-next-line no-console
 if (warning.stack) console.log(warning.stack);
};

export default (warning: Error) => {
 // eslint-disable-next-line no-console
 console.log(warning.message, warning.stack);
};

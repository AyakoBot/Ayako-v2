import getRandom from './getRandom.js';

/**
 * Extracts the file path from an error stack trace.
 *
 * @param err - The error object.
 * @returns The file path extracted from the error stack trace
 * or the message of the Error if it has no stack.
 */
export default (err: Error) =>
 `${err.stack?.split('src/')[1].split(')')[0] ?? err.message} ${err.message ?? ''} ${getRandom(0, Date.now())}`;

import spaces from './spaces.js';
import * as util from './util.js';

/**
 * Creates a formatted table from a 2D array of strings.
 *
 * @param args - The 2D array of strings representing the table data.
 * @returns The formatted table as a string.
 */
export default (args: string[][]) => {
 const columnLengths = args[0].map((a) => Number(a.length));

 const finContent = util.makeCodeBlock(
  args.map((xRow) => xRow.map((x, i) => spaces(x, columnLengths[i])).join(' | ')).join('\n'),
 );

 return finContent;
};

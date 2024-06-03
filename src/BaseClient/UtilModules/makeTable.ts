import * as Discord from 'discord.js';

/**
 * Creates a formatted table from a 2D array of strings.
 *
 * @param args - The 2D array of strings representing the table data.
 * @returns The formatted table as a string.
 */
export default (args: string[][]) => {
 const lengths = args[0].map((_, i) =>
  args.reduce((maxLen, row) => Math.max(maxLen, row[i].length), 0),
 );

 const finContent = Discord.codeBlock(
  args
   .map((xRow) => xRow.map((x, i) => (x.length ? x : ' ').padEnd(lengths[i])).join(' | '))
   .join('\n'),
 );

 return finContent;
};

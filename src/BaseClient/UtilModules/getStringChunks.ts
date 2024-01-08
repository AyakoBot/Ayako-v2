/**
 * Splits an array of strings into chunks of maximum length.
 * @param s - The array of strings to split.
 * @param maxLength - The maximum length of each chunk.
 * @returns An array of string arrays, where each inner array represents a chunk of strings.
 */
export default (s: string[], maxLength: number) => {
 const chunks: string[][] = [[]];
 let lastI = 0;

 while (s.length) {
  while (chunks[lastI].join('\n').length + Number(s.at(0)?.length) < maxLength) {
   chunks[lastI].push(s.shift() as string);
  }
  chunks.push([]);
  lastI += 1;
 }

 return chunks.map((c) => c.filter((a) => !!a.length)).filter((c) => !!c.length);
};

/**
 * Splits an array into chunks of a specified maximum length.
 * @param s The array to split into chunks.
 * @param maxLength The maximum length of each chunk.
 * @returns An array of arrays, where each inner array contains a chunk of the original array.
 */
export default <T>(s: T[], maxLength: number): T[][] => {
 const chunks: T[][] = [[]];
 let lastI = 0;

 while (s.length) {
  while (chunks[lastI].length < maxLength && s.length) {
   chunks[lastI].push(s.shift() as T);
  }
  chunks.push([]);
  lastI += 1;
 }

 if (!chunks.at(-1)?.length) chunks.pop();

 return chunks;
};

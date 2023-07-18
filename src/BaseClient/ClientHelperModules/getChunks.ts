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

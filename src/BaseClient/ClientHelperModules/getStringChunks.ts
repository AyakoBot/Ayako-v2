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

 return chunks;
};

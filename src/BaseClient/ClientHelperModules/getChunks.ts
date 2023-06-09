export default <Type>(s: Type[], maxLength: number) => {
 const chunks: Type[][] = [[]];
 let lastI = 0;

 while (s.length) {
  while (chunks[lastI].length < maxLength && s.length) {
   chunks[lastI].push(s.shift() as Type);
  }
  chunks.push([]);
  lastI += 1;
 }

 if (!chunks.at(-1)?.length) chunks.pop();

 return chunks;
};

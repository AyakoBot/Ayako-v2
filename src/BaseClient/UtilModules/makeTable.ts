export default (args: string[][]) => {
 const columnLengths = args[0].map((_, i) => Math.max(...args.map((row) => row[i]?.length || 0)));

 const finContent = args
  .map(
   (xRow) =>
    `${xRow
     .map((x, i) => `${x}${' '.repeat(Math.abs((x?.length || 0) - columnLengths[i]))}`)
     .join(' | ')}\n`,
  )
  .join('');

 return finContent;
};

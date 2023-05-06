export default (array1: unknown[], array2: unknown[]) =>
 array1
  .map((a) => JSON.stringify(a))
  .filter((i) => array2.map((a) => JSON.stringify(a)).indexOf(i) < 0)
  .map((a) => JSON.parse(a));

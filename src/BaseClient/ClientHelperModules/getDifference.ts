export default (array1: unknown[], array2: unknown[]) =>
  array1.filter((i) => array2.indexOf(i) < 0);

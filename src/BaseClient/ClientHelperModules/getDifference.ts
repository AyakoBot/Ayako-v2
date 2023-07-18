type NonFunctionPropertyNames<T> = {
 // eslint-disable-next-line @typescript-eslint/ban-types
 [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type JsonSerializable<T> = Pick<T, NonFunctionPropertyNames<T>>;

export default <T>(array1: T[], array2: T[]): JsonSerializable<T>[] =>
 array1
  .map((a) => JSON.stringify(a))
  .filter((i) => array2.map((a) => JSON.stringify(a)).indexOf(i) < 0)
  .map((a) => JSON.parse(a)) as JsonSerializable<T>[];

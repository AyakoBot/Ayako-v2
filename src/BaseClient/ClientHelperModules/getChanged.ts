/**
 * Returns an array of elements that have changed between two arrays of objects.
 * @param array1 - The first array of objects to compare.
 * @param array2 - The second array of objects to compare.
 * @param identifier - The key to use as the identifier for each object in the arrays.
 * @returns An array of elements that have changed between the two arrays of objects.
 */
export default <T>(array1: T[], array2: T[], identifier: keyof T): T[] =>
 array2?.length
  ? array2.filter(
     (e) =>
      JSON.stringify(e) !==
      JSON.stringify(array1?.find((c) => c[identifier] === e[identifier]) ?? undefined),
    )
  : array1?.filter(
     (e) =>
      JSON.stringify(e) !==
      JSON.stringify(array2?.find((c) => c[identifier] === e[identifier]) ?? undefined),
    );

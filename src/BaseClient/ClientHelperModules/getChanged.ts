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

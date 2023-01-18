export default (
  array1: { [key: string]: unknown }[] | undefined,
  array2: { [key: string]: unknown }[] | undefined,
  identifier: string,
) =>
  array2?.length
    ? array2.filter(
        (e) =>
          JSON.stringify(e) !==
            JSON.stringify(array1?.find((c) => c[identifier] === e[identifier]) ?? undefined) &&
          array1?.find((c) => c.channelId === e.channelId),
      )
    : array1?.filter(
        (e) =>
          JSON.stringify(e) !==
            JSON.stringify(array2?.find((c) => c[identifier] === e[identifier]) ?? undefined) &&
          array2?.find((c) => c[identifier] === e[identifier]),
      );

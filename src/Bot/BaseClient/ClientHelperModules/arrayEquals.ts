export default (arr1: unknown[], arr2: unknown[]) => {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;

  const results: unknown[] = [];

  arr1.every((item) => {
    if (!arr2.includes(item)) results.push(false);
    else results.push(true);
    return null;
  });

  if (!results.includes(false)) {
    arr2.every((item) => {
      if (!arr1.includes(item)) results.push(false);
      else results.push(true);
      return null;
    });
  }

  return !results.includes(false);
};

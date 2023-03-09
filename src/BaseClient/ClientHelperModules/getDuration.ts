import ms from 'ms';

export default (duration: string) => {
  const args = duration.split(/\s+/g);
  let mergedDurationArgs: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    if (Number(args[i]) === ms(args[i])) {
      mergedDurationArgs.push(`${args[i]} ${args[i + 1]}`);
      i += 1;
      continue;
    }

    mergedDurationArgs.push(args[i]);
  }

  return mergedDurationArgs.map((arg) => ms(arg)).reduce((partialSum, arg) => partialSum + arg, 0);
};

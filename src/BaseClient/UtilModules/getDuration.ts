import ms from 'ms';

/**
 * Calculates the total duration of a given time string.
 * @param duration - The time string to calculate the duration of.
 * @param max - The maximum duration allowed. If the calculated duration exceeds this value,
 * the max value is returned instead.
 * @returns The total duration in milliseconds.
 */
export default (duration: string, max?: number) => {
 const args = duration.split(/\s+/g);
 const mergedDurationArgs: string[] = [];

 for (let i = 0; i < args.length; i += 1) {
  if (Number(args[i]) === ms(args[i])) {
   mergedDurationArgs.push(`${args[i]} ${args[i + 1]}`);
   i += 1;
   break;
  }

  mergedDurationArgs.push(args[i]);
 }

 const result = mergedDurationArgs
  .map((arg) => ms(arg))
  .reduce((partialSum, arg) => partialSum + arg, 0);

 if (max && result > max) return max;
 return result;
};

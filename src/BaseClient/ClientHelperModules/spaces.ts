export default (s: string, num: number) => `${s}${' '.repeat(-Math.abs(num - s.length))}`;

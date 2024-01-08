/**
 * Returns a string with additional spaces added to the end to match the specified length.
 * If the string is already longer than the specified length, no spaces are added.
 * @param s - The string to add spaces to.
 * @param num - The desired length of the resulting string.
 * @returns A string with additional spaces added to the end to match the specified length.
 */
export default (s: string, num: number) => `${s}${' '.repeat(Math.abs(num - s.length))}`;

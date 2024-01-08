/**
 * Splits a number by thousands and returns it as a string with commas.
 * @param num - The number to split.
 * @returns The number as a string with commas separating each thousands place.
 */
const splitByThousand = (num: number): string => {
 const str = Math.round(num).toString();
 const len = str.length;
 if (len <= 3) return str;
 return `${splitByThousand(parseInt(str.slice(0, len - 3), 10))},${str.slice(len - 3)}`;
};

export default splitByThousand;

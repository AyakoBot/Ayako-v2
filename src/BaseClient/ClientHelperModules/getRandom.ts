import crypto from 'crypto';

/**
 * Returns a random integer between the specified minimum and maximum values (inclusive).
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A random integer between the specified minimum and maximum values (inclusive).
 * @throws An error if too many bytes are needed to generate the random number.
 */
export default (min: number, max: number) => {
 const range = max - min + 1;
 const bytesNeeded = Math.ceil(Math.log2(range) / 8);

 if (bytesNeeded > 6) {
  throw new Error('Too many bytes needed');
 }

 const randomBytes = crypto.randomBytes(bytesNeeded);
 let randomValue = 0n;

 for (let i = 0; i < bytesNeeded; i += 1) randomValue = randomValue * 256n + BigInt(randomBytes[i]);
 return Number(BigInt(min) + (randomValue % BigInt(range)));
};

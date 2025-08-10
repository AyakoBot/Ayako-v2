import crypto from 'crypto';

/**
 * Returns a random integer between the specified minimum and maximum values (inclusive).
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A random integer between the specified minimum and maximum values (inclusive).
 * @throws An error if too many bytes are needed to generate the random number.
 */
export default (min: number, max: number) => {
 const realMin = Math.min(min, max);
 const realMax = Math.max(min, max);
 if (realMin === realMax) return realMin;
 const minStr = realMin.toString();
 const maxStr = realMax.toString();
 const minDecimals = minStr.includes('.') ? minStr.split('.')[1].length : 0;
 const maxDecimals = maxStr.includes('.') ? maxStr.split('.')[1].length : 0;
 const decimals = Math.max(minDecimals, maxDecimals);

 const scale = Math.pow(10, decimals);
 const minInt = Math.round(min * scale);
 const maxInt = Math.round(max * scale);
 const range = maxInt - minInt + 1;
 const bytesNeeded = Math.ceil(Math.log2(range) / 8);

 if (bytesNeeded > 6) {
  throw new Error('Too many bytes needed');
 }

 try {
  crypto.randomBytes(bytesNeeded);
 } catch {
  throw new Error(`Error generating random bytes: ${bytesNeeded} - from ${min} to ${max}`);
 }

 const randomBytes = crypto.randomBytes(bytesNeeded);
 let randomValue = 0n;

 for (let i = 0; i < bytesNeeded; i += 1) randomValue = randomValue * 256n + BigInt(randomBytes[i]);
 const result = Number(BigInt(minInt) + (randomValue % BigInt(range)));
 return result / scale;
};

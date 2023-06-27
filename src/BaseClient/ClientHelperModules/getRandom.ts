import crypto from 'crypto';

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

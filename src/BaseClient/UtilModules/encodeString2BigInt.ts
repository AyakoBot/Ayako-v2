export default (str: string, base: number) => {
 let result = BigInt(0);
 let multiplier = BigInt(1);

 for (let i = str.length - 1; i >= 0; i -= 1) {
  const digit = parseInt(str[i], base);
  if (Number.isNaN(digit)) throw new Error(`Invalid character ${str[i]} for base ${base}`);

  result += BigInt(digit) * multiplier;
  multiplier *= BigInt(base);
 }

 return result;
};

const splitByThousand = (num: number): string => {
 const str = num.toString();
 const len = str.length;
 if (len <= 3) return str;
 return `${splitByThousand(parseInt(str.slice(0, len - 3), 10))},${str.slice(len - 3)}`;
};

export default splitByThousand;

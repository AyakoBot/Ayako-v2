export default (ID: bigint) => {
  const id = BigInt.asUintN(64, ID);
  const dateBits = Number(id >> 22n);
  const unix = dateBits + 1420070400000;
  return unix;
};

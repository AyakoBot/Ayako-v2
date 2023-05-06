export default (ID: string) => Number(BigInt.asUintN(64, BigInt(ID)) >> 22n) + 1420070400000;

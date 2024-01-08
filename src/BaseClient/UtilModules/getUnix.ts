/**
 * Calculates the Unix timestamp from a Discord Snowflake ID.
 * @param ID The Discord Snowflake ID to convert to Unix timestamp.
 * @returns The Unix timestamp in milliseconds.
 */
export default (ID: string) => Number(BigInt.asUintN(64, BigInt(ID)) >> 22n) + 1420070400000;

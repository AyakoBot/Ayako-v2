import Discord from 'discord.js';

export default (bit1: bigint, bit2: bigint) => {
  const bit = new Discord.PermissionsBitField(bit1 & bit2);
  const newBit1 = new Discord.PermissionsBitField(bit1).remove([...bit]);
  const newBit2 = new Discord.PermissionsBitField(bit2).remove([...bit]);
  return [newBit1.bitfield, newBit2.bitfield];
};

/**
 * Converts an ArrayBuffer to a Node.js Buffer.
 * @param ab The ArrayBuffer to convert.
 * @returns The converted Buffer.
 */
export default (ab: ArrayBuffer) => {
 const buf = Buffer.alloc(ab.byteLength);
 const view = new Uint8Array(ab);

 new Array(buf.length).fill(null).forEach((_, i) => {
  buf[i] = view[i];
 });

 return buf;
};

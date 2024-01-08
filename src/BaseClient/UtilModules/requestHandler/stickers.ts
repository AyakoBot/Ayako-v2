import getNitroStickers from './stickers/getNitroStickers.js';
import get from './stickers/get.js';

interface Stickers {
 getNitroStickers: typeof getNitroStickers;
 get: typeof get;
}

/**
 * Sticker request handler module.
 * @property {Function} getNitroStickers
 * - Function to get Nitro stickers.
 * @property {Function} get
 * - Function to get a sticker.
 */
const stickers: Stickers = {
 getNitroStickers,
 get,
};

export default stickers;

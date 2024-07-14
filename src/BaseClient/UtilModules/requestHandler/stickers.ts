import getStickers from './stickers/getStickers.js';
import get from './stickers/get.js';

interface Stickers {
 getStickers: typeof getStickers;
 get: typeof get;
}

/**
 * Sticker request handler module.
 * @property {Function} getStickers
 * - Function to get Nitro stickers.
 * @property {Function} get
 * - Function to get a sticker.
 */
const stickers: Stickers = {
 getStickers,
 get,
};

export default stickers;

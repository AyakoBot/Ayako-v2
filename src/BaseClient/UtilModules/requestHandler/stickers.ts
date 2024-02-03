import importCache from '../importCache/BaseClient/UtilModules/requestHandler/stickers.js';

interface Stickers {
 getNitroStickers: typeof importCache.getNitroStickers.file.default;
 get: typeof importCache.get.file.default;
}

/**
 * Sticker request handler module.
 * @property {Function} getNitroStickers
 * - Function to get Nitro stickers.
 * @property {Function} get
 * - Function to get a sticker.
 */
const stickers: Stickers = {
 getNitroStickers: importCache.getNitroStickers.file.default,
 get: importCache.get.file.default,
};

export default stickers;

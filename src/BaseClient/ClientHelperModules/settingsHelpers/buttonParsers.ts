import back from './buttonParsers/back.js';
import boolean from './buttonParsers/boolean.js';
import create from './buttonParsers/create.js';
import del from './buttonParsers/delete.js';
import global from './buttonParsers/global.js';
import next from './buttonParsers/next.js';
import previous from './buttonParsers/previous.js';
import setting from './buttonParsers/setting.js';
import specific from './buttonParsers/specific.js';

/**
 * An object containing functions for creating Discord API button components
 * used in the settings editor.
 */
export default {
 back,
 delete: del,
 global,
 next,
 previous,
 setting,
 specific,
 boolean,
 create,
};

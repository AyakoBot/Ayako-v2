import embedParsers from './settingsHelpers/embedParsers.js';
import buttonParsers from './settingsHelpers/buttonParsers.js';
import multiRowHelpers from './settingsHelpers/multiRowHelpers.js';
import updateLog from './settingsHelpers/updateLog.js';
import changeHelpers from './settingsHelpers/changeHelpers.js';
import getSettingsFile from './settingsHelpers/getSettingsFile.js';
import setup from './settingsHelpers/setup.js';
import del from './settingsHelpers/del.js';
import getStyle from './settingsHelpers/getStyle.js';
import getEmoji from './settingsHelpers/getEmoji.js';

/**
 * Helper functions for managing settings.
 * @property {Object} embedParsers
 * - Functions for parsing embed settings.
 * @property {Object} buttonParsers
 * - Functions for parsing button settings.
 * @property {Object} multiRowHelpers
 * - Functions for managing multi-row settings.
 * @property {Function} updateLog
 * - Function for updating the settings log.
 * @property {Object} changeHelpers
 * - Functions for managing changes to settings.
 * @property {Function} getSettingsFile
 * - Function for getting the settings file.
 * @property {Function} setup
 * - Function for setting up the settings file.
 * @property {Function} del
 * - Function for deleting a setting.
 */
export default {
 embedParsers,
 buttonParsers,
 multiRowHelpers,
 updateLog,
 changeHelpers,
 getSettingsFile,
 setup,
 del,
 getStyle,
 getEmoji,
};

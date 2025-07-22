import buttonParsers from './settingsHelpers/buttonParsers.js';
import changeHelpers from './settingsHelpers/changeHelpers.js';
import componentParsers from './settingsHelpers/componentParsers.js';
import del from './settingsHelpers/del.js';
import embedParsers from './settingsHelpers/embedParsers.js';
import getEmoji from './settingsHelpers/getEmoji.js';
import getSettingsFile from './settingsHelpers/getSettingsFile.js';
import getStyle from './settingsHelpers/getStyle.js';
import multiRowHelpers from './settingsHelpers/multiRowHelpers.js';
import permissionCheck from './settingsHelpers/permissionCheck.js';
import setup from './settingsHelpers/setup.js';
import updateLog from './settingsHelpers/updateLog.js';
import getUniquetimestampFromId from './settingsHelpers/getUniquetimestampFromId.js';
import showOverview from './settingsHelpers/showOverview.js';

/**
 * Function for checking if a user has permission to change a setting.
 * @property {Object} permissionCheck
 * Helper functions for managing settings.
 * @property {Object} embedParsers
 * - Functions for parsing embed settings.
 * @property {Object} buttonParsers
 * - Functions for parsing button settings.
 * @property {Object} componentParsers
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
 * @property {Function} getUniquetimestampFromId
 * - Function for getting the uniquetimestamp from an id.
 * @property {Function} showOverview
 * - Function for showing an overview of settings.
 * @property {Function} getStyle
 * - Function for getting the style of a setting.
 * @property {Function} getEmoji
 * - Function for getting the emoji of a setting.
 */
export default {
 permissionCheck,
 embedParsers,
 buttonParsers,
 componentParsers,
 multiRowHelpers,
 updateLog,
 changeHelpers,
 getSettingsFile,
 setup,
 del,
 getStyle,
 getEmoji,
 getUniquetimestampFromId,
 showOverview,
};

import getCurrent from './applications/getCurrent.js';
import editCurrent from './applications/editCurrent.js';

interface Applications {
 getCurrent: typeof getCurrent;
 editCurrent: typeof editCurrent;
}

/**
 * An object containing methods for handling application-related requests.
 * @property {Function} getCurrent
 * - Gets the current Application.
 * @property {Function} editCurrent
 * - Edits the current Application.
 */
const applications: Applications = {
 getCurrent,
 editCurrent,
};

export default applications;

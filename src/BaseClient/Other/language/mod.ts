import * as CT from '../../../Typings/CustomTypings.js';
import logs from './mod/logs.js';
import execution from './mod/execution.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod,
 logs: logs(t),
 execution: execution(t),
});

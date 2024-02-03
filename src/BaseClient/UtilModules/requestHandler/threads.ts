import importCache from '../importCache/BaseClient/UtilModules/requestHandler/threads.js';

interface Threads {
 join: typeof importCache.join.file.default;
 addMember: typeof importCache.addMember.file.default;
 leave: typeof importCache.leave.file.default;
 removeMember: typeof importCache.removeMember.file.default;
 getMember: typeof importCache.getMember.file.default;
 getAllMembers: typeof importCache.getAllMembers.file.default;
}

/**
 * Object containing methods for handling threads.
 * @property {Function} join
 * - Method for joining a thread.
 * @property {Function} addMember
 * - Method for adding a member to a thread.
 * @property {Function} leave
 * - Method for leaving a thread.
 * @property {Function} removeMember
 * - Method for removing a member from a thread.
 * @property {Function} getMember
 * - Method for getting a member from a thread.
 * @property {Function} getAllMembers
 * - Method for getting all members from a thread.
 */
const threads: Threads = {
 join: importCache.join.file.default,
 addMember: importCache.addMember.file.default,
 leave: importCache.leave.file.default,
 removeMember: importCache.removeMember.file.default,
 getMember: importCache.getMember.file.default,
 getAllMembers: importCache.getAllMembers.file.default,
};

export default threads;

import join from './threads/join.js';
import addMember from './threads/addMember.js';
import leave from './threads/leave.js';
import removeMember from './threads/removeMember.js';
import getMember from './threads/getMember.js';
import getAllMembers from './threads/getAllMembers.js';

interface Threads {
 join: typeof join;
 addMember: typeof addMember;
 leave: typeof leave;
 removeMember: typeof removeMember;
 getMember: typeof getMember;
 getAllMembers: typeof getAllMembers;
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
 join,
 addMember,
 leave,
 removeMember,
 getMember,
 getAllMembers,
};

export default threads;

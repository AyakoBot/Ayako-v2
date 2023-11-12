import join from './threads/join.js';
import addMember from './threads/addMember.js';
import leave from './threads/leave.js';
import removeMember from './threads/removeMember.js';
import getMember from './threads/getMember.js';
import getAllMembers from './threads/getAllMembers.js';

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
export default {
 join,
 addMember,
 leave,
 removeMember,
 getMember,
 getAllMembers,
};

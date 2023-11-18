import * as CT from '../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.time,
 timeAgo: (time: string) => t.stp(t.JSON.time.timeAgo, { time }),
 timeIn: (time: string) => t.stp(t.JSON.time.timeIn, { time }),
});

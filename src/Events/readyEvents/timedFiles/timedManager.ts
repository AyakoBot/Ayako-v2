import separatorControl from './separators.js';
import expiry from './expiry.js';
import stats from './stats.js';

export default async () => {
 expiry();
 stats();
 separatorControl();
};

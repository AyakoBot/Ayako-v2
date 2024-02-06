import expiry from './expiry.js';
import separatorControl from './separators.js';
import stats from './stats.js';
import amQuarantineControl from './amQuarantineControl.js';

export default async () => {
 expiry();
 stats();
 separatorControl();
 amQuarantineControl();
};

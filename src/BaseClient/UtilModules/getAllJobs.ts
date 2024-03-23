import * as Jobs from 'node-schedule';

export default () => {
 const path = Object.keys(Jobs.scheduledJobs).map((k) => k.split(/\s+/g)[0]);
 const res: { [key: string]: number } = {};

 path.forEach((p) => {
  if (res[p]) res[p] += 1;
  else res[p] = 1;
 });

 return res;
};

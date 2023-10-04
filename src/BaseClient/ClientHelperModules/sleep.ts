import * as Jobs from 'node-schedule';

/**
 * Delays the execution of the function for a specified number of ms.
 * @param ms - The number of ms to delay the execution.
 * @returns A Promise that resolves after the specified number of ms.
 */
export default async (ms: number): Promise<true> =>
 new Promise((res) => {
  Jobs.scheduleJob(new Date(Date.now() + ms), () => {
   res(true);
  });
 });

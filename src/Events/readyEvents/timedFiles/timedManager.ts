export default async () => {
  (await import('./separatorControl.js')).default();
  (await import('./expiry.js')).default();
  (await import('./stats.js')).default();
};

export default async () => {
 (await import('./expiry.js')).default();
 (await import('./stats.js')).default();
};

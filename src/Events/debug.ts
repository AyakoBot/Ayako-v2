export default (info: string) => {
  if (info.includes('Heartbeat')) return;

  // eslint-disable-next-line no-console
  console.log(info);
};

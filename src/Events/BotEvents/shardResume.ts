export default (id: number, replayed: number) => {
 // eslint-disable-next-line no-console
 console.log(`[Shard ${id + 1}] Resuming - Replayed Events: ${replayed}`);
};

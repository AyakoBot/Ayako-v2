export default (error: Error, id: number) => {
 // eslint-disable-next-line no-console
 console.log(`[Shard ${id + 1}] Error: ${error.message}`);
 // eslint-disable-next-line no-console
 if (error.stack) console.log(error.stack);
};

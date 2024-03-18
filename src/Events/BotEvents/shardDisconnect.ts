export default (event: CloseEvent, id: number) => {
 // eslint-disable-next-line no-console
 console.log(`[Shard ${id + 1}] Disconnected - ${event.reason}`);
};

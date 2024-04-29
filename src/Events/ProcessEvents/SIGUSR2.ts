import * as v8 from 'v8';

export default async () => {
 v8.writeHeapSnapshot(`${Date.now()}.heapsnapshot`);
};

import inspector from 'inspector';
import fs from 'fs';
import path from 'path';

interface HeapNode {
 type: string;
 name: string;
 id: number;
 self_size: number;
 edge_count: number;
 trace_node_id: number;
}

interface HeapSnapshot {
 nodes: number[];
 edges: number[];
 strings: string[];
 node_fields: string[];
 edge_fields: string[];
}

export default (context?: string): Promise<{
 largestObjects: Array<{ name: string; type: string; size: number }>;
 totalSize: number;
}> => {
 return new Promise((resolve, reject) => {
  const session = new inspector.Session();
  session.connect();

  session.post('HeapProfiler.enable', (err) => {
   if (err) {
    session.disconnect();
    return reject(err);
   }

   session.post('HeapProfiler.takeHeapSnapshot', (err) => {
    if (err) {
     session.disconnect();
     return reject(err);
    }

    const chunks: string[] = [];

    session.on('HeapProfiler.addHeapSnapshotChunk', (message) => {
     chunks.push(message.params.chunk);
    });

    session.on('HeapProfiler.reportHeapSnapshotProgress', (message) => {
     if (message.params.finished) {
      try {
       const profile = chunks.join('');
       const data: HeapSnapshot = JSON.parse(profile) as HeapSnapshot;

       const result = analyzeHeapSnapshot(data);

       saveHeapData(profile, result, context);

       session.disconnect();
       resolve(result);
      } catch (parseErr) {
       session.disconnect();
       reject(parseErr);
      }
     }
    });
   });
  });
 });
};

function analyzeHeapSnapshot(data: HeapSnapshot): {
 largestObjects: Array<{ name: string; type: string; size: number }>;
 totalSize: number;
} {
 const { nodes, strings, node_fields } = data;
 const nodeFieldCount = node_fields.length;

 // Parse nodes from flat array
 const parsedNodes: HeapNode[] = [];
 let totalSize = 0;

 for (let i = 0; i < nodes.length; i += nodeFieldCount) {
  const node: HeapNode = {
   type: strings[nodes[i]],
   name: strings[nodes[i + 1]],
   id: nodes[i + 2],
   self_size: nodes[i + 3],
   edge_count: nodes[i + 4],
   trace_node_id: nodes[i + 5],
  };

  parsedNodes.push(node);
  totalSize += node.self_size;
 }

 const largestObjects = parsedNodes
  .filter((node) => node.self_size > 1024) // Filter objects larger than 1KB
  .sort((a, b) => b.self_size - a.self_size)
  .slice(0, 20) // Top 20 largest objects
  .map((node) => ({
   name: node.name || `(${node.type})`,
   type: node.type,
   size: node.self_size,
  }));

 return {
  largestObjects,
  totalSize,
 };
}

function saveHeapData(
 profile: string,
 analysis: {
  largestObjects: Array<{ name: string; type: string; size: number }>;
  totalSize: number;
 },
 context?: string,
): void {
 const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
 const contextSuffix = context ? `-${context}` : '';
 const logsDir = '/apps/Ayako/packages/Bot/logs';

 if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
 }

 const snapshotPath = path.join(logsDir, `heap-snapshot-${timestamp}${contextSuffix}.heapsnapshot`);
 fs.writeFileSync(snapshotPath, profile);

 const analysisPath = path.join(logsDir, `heap-analysis-${timestamp}${contextSuffix}.json`);
 const analysisData = {
  timestamp: new Date().toISOString(),
  totalSize: analysis.totalSize,
  totalSizeMB: Math.round((analysis.totalSize / 1024 / 1024) * 100) / 100,
  largestObjects: analysis.largestObjects.map((obj) => ({
   ...obj,
   sizeMB: Math.round((obj.size / 1024 / 1024) * 100) / 100,
  })),
 };
 fs.writeFileSync(analysisPath, JSON.stringify(analysisData, null, 2));

 console.log(`Heap snapshot saved to: ${snapshotPath}`);
 console.log(`Analysis saved to: ${analysisPath}`);
}

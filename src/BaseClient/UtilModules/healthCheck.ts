import client from '../Bot/Client.js';
import fs from 'fs';

let lastHeartbeat = Date.now();
let missedHeartbeats = 0;
const HEARTBEAT_INTERVAL = 60000; // 1 minute
const MAX_MISSED_HEARTBEATS = 3;

let healtcheckRunning = false;

export function startHealthCheck() {
 if (healtcheckRunning) return;
 healtcheckRunning = true;

 // Update heartbeat on Discord events
 client.on('raw', () => {
  lastHeartbeat = Date.now();
  missedHeartbeats = 0;
 });

 // Check heartbeat health
 setInterval(() => {
  fs.writeFileSync('/app/Ayako/alive.txt', Date.now().toString());

  const timeSinceLastHeartbeat = Date.now() - lastHeartbeat;

  if (timeSinceLastHeartbeat > HEARTBEAT_INTERVAL * 2) {
   missedHeartbeats++;
   console.warn(
    `WARNING: No Discord activity for ${(timeSinceLastHeartbeat / 1000).toFixed(0)} seconds (missed heartbeats: ${missedHeartbeats})`,
   );

   if (missedHeartbeats >= MAX_MISSED_HEARTBEATS) {
    console.error('CRITICAL: Bot appears to be frozen, forcing restart');
    process.exit(1);
   }
  } else {
   missedHeartbeats = 0;
  }

  // Check WebSocket connection
  if (client.ws.status !== 0) {
   // 0 = READY
   console.warn(`WebSocket not ready: Status ${client.ws.status}`);
  }

  // Check if bot can still respond
  if (client.ws.ping > 1000) {
   console.warn(`High WebSocket ping: ${client.ws.ping}ms`);
  }
 }, HEARTBEAT_INTERVAL);

 console.log('=> Health check monitor started');
}

// Watchdog timer to detect complete freezes
let watchdogTimer: NodeJS.Timeout;

export function resetWatchdog() {
 if (watchdogTimer) clearTimeout(watchdogTimer);

 watchdogTimer = setTimeout(() => {
  console.error('CRITICAL: Watchdog timeout - process appears completely frozen');
  process.exit(1);
 }, 300000); // 5 minutes
}

// Reset watchdog periodically if everything is working
setInterval(() => {
 resetWatchdog();
}, 60000);

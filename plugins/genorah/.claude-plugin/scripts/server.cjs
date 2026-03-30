#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- CLI args ---
const args = process.argv.slice(2);
let screenDir = null;
let port = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--screen-dir' && args[i + 1]) screenDir = args[++i];
  else if (args[i] === '--port' && args[i + 1]) port = parseInt(args[++i], 10);
}

if (!screenDir) {
  process.stderr.write('Usage: node server.cjs --screen-dir <path> [--port PORT]\n');
  process.exit(1);
}

screenDir = path.resolve(screenDir);
if (!port) port = 49152 + Math.floor(Math.random() * (65535 - 49152 + 1));

// --- Frame template ---
const FALLBACK_FRAME = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Genorah</title></head><body><!-- CONTENT --></body></html>';
let frameTemplate;
try {
  frameTemplate = fs.readFileSync(path.join(__dirname, 'frame-template.html'), 'utf8');
} catch (_) {
  frameTemplate = FALLBACK_FRAME;
}

// --- Helper.js loader ---
let helperScript = '';
try {
  helperScript = '<script>' + fs.readFileSync(path.join(__dirname, 'helper.js'), 'utf8') + '</script>';
} catch (_) {
  // helper.js not present yet, skip injection
}

// --- MIME types ---
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// --- Idle timeout ---
const IDLE_MS = 30 * 60 * 1000;
let lastRequest = Date.now();
const idleCheck = setInterval(() => {
  if (Date.now() - lastRequest > IDLE_MS) {
    cleanup();
    process.exit(0);
  }
}, 60_000);
idleCheck.unref();

// --- WebSocket state ---
const WS_MAGIC = '258EAFA5-E914-47DA-95CA-5AB5DC086C31';
const clients = new Set();

// --- Utility: newest HTML file in screenDir ---
function newestHtml() {
  let files;
  try { files = fs.readdirSync(screenDir); } catch (_) { return null; }
  let best = null;
  let bestMtime = 0;
  for (const f of files) {
    if (!f.endsWith('.html')) continue;
    try {
      const st = fs.statSync(path.join(screenDir, f));
      if (st.mtimeMs > bestMtime) { bestMtime = st.mtimeMs; best = f; }
    } catch (_) { /* skip */ }
  }
  return best;
}

// --- Utility: wrap fragment in frame ---
function wrapFragment(content) {
  const isFullDoc = /<!DOCTYPE|<html/i.test(content);
  let html;
  if (isFullDoc) {
    html = content;
  } else {
    html = frameTemplate.replace('<!-- CONTENT -->', content);
  }
  // Inject helper.js before </body>
  if (helperScript) {
    html = html.replace(/<\/body>/i, helperScript + '</body>');
  }
  return html;
}

// --- Waiting page ---
function waitingPage() {
  const body = `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;
    font-family:system-ui,sans-serif;background:#0a0a0a;color:#e0e0e0">
    <div style="text-align:center"><h1 style="font-size:1.5rem;font-weight:400;opacity:.7">
    Waiting for Genorah&hellip;</h1>
    <p style="opacity:.4;margin-top:.5rem;font-size:.85rem">Screens will appear here automatically</p>
    </div></div>`;
  return wrapFragment(body);
}

// --- HTTP handler ---
function handleRequest(req, res) {
  lastRequest = Date.now();
  res.setHeader('Cache-Control', 'no-store');

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // GET /
  if (pathname === '/' && req.method === 'GET') {
    const newest = newestHtml();
    if (!newest) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(waitingPage());
      return;
    }
    try {
      const content = fs.readFileSync(path.join(screenDir, newest), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(wrapFragment(content));
    } catch (e) {
      res.writeHead(500);
      res.end('Read error');
    }
    return;
  }

  // GET /files/*
  if (pathname.startsWith('/files/') && req.method === 'GET') {
    const relative = pathname.slice('/files/'.length);
    if (relative.includes('..')) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    const filePath = path.join(screenDir, relative);
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    } catch (_) {
      res.writeHead(404);
      res.end('Not found');
    }
    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not found');
}

// --- WebSocket frame encoding ---
function encodeFrame(opcode, payload) {
  const buf = Buffer.isBuffer(payload) ? payload : Buffer.from(payload, 'utf8');
  const len = buf.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x80 | opcode;
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, buf]);
}

// --- WebSocket frame decoding ---
function decodeFrame(data) {
  if (data.length < 2) return null;
  const opcode = data[0] & 0x0f;
  const masked = (data[1] & 0x80) !== 0;
  let payloadLen = data[1] & 0x7f;
  let offset = 2;

  if (payloadLen === 126) {
    if (data.length < 4) return null;
    payloadLen = data.readUInt16BE(2);
    offset = 4;
  } else if (payloadLen === 127) {
    if (data.length < 10) return null;
    payloadLen = Number(data.readBigUInt64BE(2));
    offset = 10;
  }

  let maskKey = null;
  if (masked) {
    if (data.length < offset + 4) return null;
    maskKey = data.slice(offset, offset + 4);
    offset += 4;
  }

  if (data.length < offset + payloadLen) return null;
  const payload = data.slice(offset, offset + payloadLen);

  if (masked && maskKey) {
    for (let i = 0; i < payload.length; i++) {
      payload[i] ^= maskKey[i & 3];
    }
  }

  return { opcode, payload };
}

// --- WebSocket upgrade handler ---
function handleUpgrade(req, socket) {
  const key = req.headers['sec-websocket-key'];
  if (!key) { socket.destroy(); return; }

  const accept = crypto.createHash('sha1')
    .update(key + WS_MAGIC)
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n` +
    '\r\n'
  );

  clients.add(socket);
  socket.on('data', (buf) => {
    const frame = decodeFrame(buf);
    if (!frame) return;

    if (frame.opcode === 0x01) {
      // TEXT
      const text = frame.payload.toString('utf8');
      try {
        const msg = JSON.parse(text);
        const logEntry = JSON.stringify({ type: 'ws-message', ts: new Date().toISOString(), data: msg });
        process.stdout.write(logEntry + '\n');
        if (msg.choice !== undefined) {
          const eventsPath = path.join(screenDir, '.events');
          fs.appendFileSync(eventsPath, logEntry + '\n');
        }
      } catch (_) {
        // not JSON, ignore
      }
    } else if (frame.opcode === 0x08) {
      // CLOSE
      socket.end(encodeFrame(0x08, Buffer.alloc(0)));
      clients.delete(socket);
    } else if (frame.opcode === 0x09) {
      // PING -> PONG
      socket.write(encodeFrame(0x0a, frame.payload));
    }
  });

  socket.on('close', () => clients.delete(socket));
  socket.on('error', () => clients.delete(socket));
}

// --- Broadcast ---
function broadcast(data) {
  const frame = encodeFrame(0x01, JSON.stringify(data));
  for (const client of clients) {
    try { client.write(frame); } catch (_) { clients.delete(client); }
  }
}

// --- File watcher ---
const debounceTimers = new Map();

function startWatcher() {
  try {
    fs.mkdirSync(screenDir, { recursive: true });
  } catch (_) { /* exists */ }

  fs.watch(screenDir, (eventType, filename) => {
    if (!filename || !filename.endsWith('.html')) return;

    // 100ms debounce per filename
    if (debounceTimers.has(filename)) clearTimeout(debounceTimers.get(filename));
    debounceTimers.set(filename, setTimeout(() => {
      debounceTimers.delete(filename);

      // Delete .events on new screen
      const eventsPath = path.join(screenDir, '.events');
      try { fs.unlinkSync(eventsPath); } catch (_) { /* ok */ }

      const logEntry = { type: 'screen-added', file: filename, ts: new Date().toISOString() };
      process.stdout.write(JSON.stringify(logEntry) + '\n');

      broadcast({ type: 'reload', file: filename });
    }, 100));
  });
}

// --- Cleanup ---
function cleanup() {
  clearInterval(idleCheck);
  try { fs.unlinkSync(path.join(screenDir, '.server-info')); } catch (_) { /* ok */ }
}

process.on('SIGTERM', () => { cleanup(); process.exit(0); });
process.on('SIGINT', () => { cleanup(); process.exit(0); });

// --- Start server ---
const server = http.createServer(handleRequest);
server.on('upgrade', handleUpgrade);

server.listen(port, '127.0.0.1', () => {
  const info = {
    type: 'companion-server',
    port,
    host: '127.0.0.1',
    url_host: `http://127.0.0.1:${port}`,
    url: `http://127.0.0.1:${port}/`,
    screen_dir: screenDir,
    pid: process.pid,
  };

  // Write .server-info
  try {
    fs.writeFileSync(path.join(screenDir, '.server-info'), JSON.stringify(info, null, 2));
  } catch (_) { /* screen-dir may not exist yet */ }

  // Log startup
  process.stdout.write(JSON.stringify({ type: 'server-started', ...info }) + '\n');

  startWatcher();
});

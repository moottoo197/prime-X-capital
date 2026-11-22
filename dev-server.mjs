import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_ROOT = path.resolve(__dirname, 'public_html');
const PORT = Number(process.env.DEFAULT_APP_PORT) || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.apk': 'application/vnd.android.package-archive',
  '.ipa': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  const method = (req.method || 'GET').toUpperCase();
  const rawUrl = req.url || '/';
  let pathname = '/';
  try {
    pathname = decodeURIComponent(rawUrl.split('?')[0] || '/');
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Block hidden dotfiles (.htaccess, .env, etc.)
  const segments = pathname.split('/').filter(Boolean);
  if (segments.some((seg) => seg.startsWith('.'))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  // PHP endpoints cannot execute inside the Node preview container; return safe JSON/HTML instead of raw source
  if (pathname.startsWith('/api/') || pathname.endsWith('.php') || pathname === '/console' || pathname === '/logs') {
    const payload = JSON.stringify({
      success: false,
      error_code: 'PHP_RUNTIME_UNAVAILABLE',
      message: 'Backend PHP endpoints are served on the production PHP host.',
    });
    res.writeHead(503, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(method === 'HEAD' ? undefined : payload);
    return;
  }

  if (method !== 'GET' && method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  const candidate = path.resolve(PUBLIC_ROOT, '.' + pathname);
  if (candidate !== PUBLIC_ROOT && !candidate.startsWith(PUBLIC_ROOT + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  let target = candidate;
  try {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      target = path.join(target, 'index.html');
    }
  } catch {
    // Fall through to 404 check below
  }

  fs.stat(target, (err, stat) => {
    if (err || !stat.isFile()) {
      const notFoundPath = path.join(PUBLIC_ROOT, '404.html');
      fs.readFile(notFoundPath, (nfErr, nfData) => {
        res.writeHead(404, {
          'Content-Type': nfErr ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        });
        if (method === 'HEAD') {
          res.end();
        } else {
          res.end(nfErr ? 'Not Found' : nfData);
        }
      });
      return;
    }

    const ext = path.extname(target).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache',
    });
    if (method === 'HEAD') {
      res.end();
      return;
    }
    const stream = fs.createReadStream(target);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      res.end('Internal Server Error');
    });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Dev server listening on http://localhost:${PORT}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

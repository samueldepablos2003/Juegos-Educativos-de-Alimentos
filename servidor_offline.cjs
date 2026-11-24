const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const distDir = path.resolve(process.argv[2] || path.join(__dirname, 'dist'));

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('Error: No se encontro la carpeta compilada:', distDir);
  process.exit(1);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
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
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(distDir, safePath === '/' || safePath === '\\' ? 'index.html' : safePath);

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        // SPA fallback for routes without file extension
        if (!path.extname(filePath)) {
          fs.readFile(path.join(distDir, 'index.html'), (idxErr, idxData) => {
            if (idxErr) {
              res.writeHead(404);
              res.end('Not found');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(idxData);
          });
          return;
        }
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

function startServer(port) {
  server.listen(port, '127.0.0.1', () => {
    const actualPort = server.address().port;
    const url = `http://127.0.0.1:${actualPort}`;
    console.log('');
    console.log('====================================================');
    console.log('  NutriPlato funcionando 100% sin internet');
    console.log(`  Abre en tu navegador: ${url}`);
    console.log('  No cierres esta ventana mientras uses el juego.');
    console.log('====================================================');
    console.log('');

    if (process.env.NO_OPEN !== '1') {
      exec(`start "" "${url}"`);
    }
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    startServer(0);
  } else {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
});

startServer(4173);

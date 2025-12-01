import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.yaml': 'text/yaml'
};

const routeMap = {
  '/': '/index.html',
  '/docs': '/docs/Docs.html',
  '/blog': '/docs/Blog.html',
  '/getnames': '/src/getnames.html',
  '/getnamesbysearch': '/src/getnamesbysearch.html',
  '/getnamesbyletter': '/src/getnamesbyletter.html',
  '/getnamesbyreligion': '/src/getnamesbyreligion.html',
  '/getfilteroptions': '/src/getfilters.html',
  '/health': null
};

function serveFile(res, filePath) {
  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
    return true;
  } catch (err) {
    return false;
  }
}

const server = createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  
  if (urlPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: "healthy",
      service: "NameVerse API",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      endpoints: {
        documentation: "/",
        docs: "/docs",
        blog: "/blog"
      }
    }, null, 2));
    return;
  }

  const directPath = join(__dirname, urlPath);
  if (existsSync(directPath) && statSync(directPath).isFile()) {
    if (serveFile(res, directPath)) return;
  }

  if (routeMap[urlPath]) {
    const mappedPath = join(__dirname, routeMap[urlPath]);
    if (serveFile(res, mappedPath)) return;
  }

  const nameMatch = urlPath.match(/^\/names\/([^\/]+)\/([^\/]+)\/?$/);
  if (nameMatch) {
    const slugPath = join(__dirname, 'src', 'getnamesbyslug.html');
    if (serveFile(res, slugPath)) return;
  }

  const indexPath = join(__dirname, 'index.html');
  if (serveFile(res, indexPath)) return;

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running at http://0.0.0.0:${PORT}`);
});

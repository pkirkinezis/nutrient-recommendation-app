/**
 * NutriCompass - Express Server for Production
 * 
 * This server serves the built static files from the dist folder.
 * Use this when you want to run the app on a Node.js server.
 * 
 * Usage:
 *   1. npm run build
 *   2. node server.js
 *   
 * Or with PM2:
 *   pm2 start server.js --name nutricompass
 */

const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Enable gzip compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy (formerly Feature-Policy)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy - adjust as needed for your deployment
  if (IS_PRODUCTION) {
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",  // unsafe-inline needed for Vite builds
      "style-src 'self' 'unsafe-inline'",   // unsafe-inline needed for Tailwind
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'self'",
    ].join('; '));
    
    // HSTS - only enable when running behind HTTPS
    if (process.env.ENABLE_HSTS === 'true') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
  }
  
  // X-XSS-Protection is deprecated and can cause issues in modern browsers
  // Modern browsers use CSP instead, so we don't set X-XSS-Protection
  
  next();
});

// Serve static files with caching
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Don't cache HTML files
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    // Cache hashed assets aggressively
    if (filePath.match(/\.[0-9a-f]{8}\./)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.status(200).json({
    name: 'NutriCompass',
    description: 'Smart, Safety-First Supplement Guide',
    version: '1.0.0'
  });
});

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log('');
  console.log('  🌿 ═══════════════════════════════════════════');
  console.log('  🌿  NutriCompass - Smart Supplement Guide');
  console.log('  🌿 ═══════════════════════════════════════════');
  console.log('');
  console.log(`  ➜  Local:   http://localhost:${PORT}`);
  console.log(`  ➜  Network: http://${HOST}:${PORT}`);
  console.log(`  ➜  Mode:    ${IS_PRODUCTION ? 'Production' : 'Development'}`);
  console.log('');
  console.log('  Ready to serve! Press Ctrl+C to stop.');
  console.log('');
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for accurate client IP behind load balancer
app.set('trust proxy', true);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint for Kubernetes probes and Argo CD
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Readiness check - can include dependency checks
app.get('/ready', (req, res) => {
  // Add dependency checks here (database, cache, etc.)
  res.status(200).json({
    ready: true,
    checks: {
      server: 'ok'
    }
  });
});

// Main endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from GitOps-FinOps showcase!',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint (basic - for Prometheus scraping)
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",endpoint="/"} 1

# HELP app_info Application information
# TYPE app_info gauge
app_info{version="${process.env.npm_package_version || '1.0.0'}"} 1
  `.trim());
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sample app listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

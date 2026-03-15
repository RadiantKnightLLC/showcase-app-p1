# Sample App - GitOps-FinOps Showcase

A simple Node.js/Express application demonstrating GitOps delivery patterns and FinOps cost allocation.

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm start

# Run in development mode with auto-reload
npm run dev
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Application info |
| `GET /health` | Health check for Kubernetes probes |
| `GET /ready` | Readiness check |
| `GET /metrics` | Prometheus-compatible metrics |

## Docker

```bash
# Build image
docker build -t sample-app:latest .

# Run container
docker run -p 8080:8080 sample-app:latest

# Test health endpoint
curl http://localhost:8080/health
```

## CI/CD

This repository uses GitHub Actions to:
1. Build Docker images on every push to `main`
2. Tag images with git SHA and semantic version
3. Push to GitHub Container Registry (ghcr.io)
4. Run security scanning with Trivy

## Architecture

- **Framework**: Express.js
- **Runtime**: Node.js 18
- **Port**: 8080
- **Non-root user**: `nodejs` (UID 1001)
- **Health checks**: Built-in HTTP probes

## GitOps Integration

This app is designed to work with:
- Argo CD for GitOps delivery
- Argo CD Image Updater for automatic promotions
- Kubecost for cost allocation

## License

MIT

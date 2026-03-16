# Tic-Tac-Toe - GitOps-FinOps Showcase App

A modern React + TypeScript + Vite tic-tac-toe game used to demonstrate GitOps and FinOps practices.

## Features

- ⚡ **Vite** - Fast development and optimized builds
- ⚛️ **React 19** - Latest React with hooks
- 🔷 **TypeScript** - Type safety
- 🎨 **Tailwind CSS** - Modern styling
- 🧪 **Vitest** - Unit testing
- 🐳 **Docker** - Multi-stage production build
- ☸️ **GitOps** - Argo CD managed deployment
- 💰 **FinOps** - Cost allocation via Kubecost labels

## Quick Start

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

## Docker

```bash
# Build image
docker build -t tic-tac-toe .

# Run container
docker run -p 8080:80 tic-tac-toe

# Test health endpoint
curl http://localhost:8080/health
```

## CI/CD Pipeline

GitHub Actions workflow:
1. **Test** - Run unit tests
2. **Lint** - ESLint + TypeScript checks
3. **Build & Push** - Build Docker image and push to GHCR
4. **Security Scan** - Trivy vulnerability scan
5. **GitOps Update** - Argo CD Image Updater detects new image

## GitOps Deployment

This app is deployed via Argo CD from the `gitops-cost-showcase` repository:

| Environment | Image Tag | Sync Strategy |
|-------------|-----------|---------------|
| Dev | `sha-XXXXXXX` (latest) | Automatic via Image Updater |
| Prod | `vX.Y.Z` (semver) | Manual PR approval |

## FinOps Labels

All deployments include cost allocation labels:

```yaml
labels:
  environment: dev|prod
  team: platform
  cost-center: agency-rnd
  owner: agency-internal
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/` | Tic-tac-toe game UI |
| `/health` | Health check (returns "healthy") |

## Repository Structure

```
sample-app/
├── .github/workflows/     # CI/CD pipeline
├── src/                   # React source code
├── public/                # Static assets
├── Dockerfile             # Multi-stage build
├── package.json           # Node dependencies
└── README.md              # This file
```

## License

MIT - Part of GitOps-FinOps showcase

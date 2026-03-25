# Tic-Tac-Toe - GitOps-FinOps Showcase App

A modern React + TypeScript Tic-Tac-Toe game featuring **in-browser PostgreSQL persistence** via PGlite, used to demonstrate GitOps and FinOps practices.

## Features

### Game Features
- 🎮 **Classic Tic-Tac-Toe** - Two-player gameplay with X and O
- 🏆 **Score Tracking** - Tracks wins for Player X, Player O, and draws
- 📝 **Player Name Memory** - Pre-fills names from localStorage/previous games
- 🔄 **Play Again** - Quick rematch with same players
- 📊 **Game History** - View all past games with timestamps

### Technical Highlights
- ⚡ **Vite** - Fast development and optimized builds
- ⚛️ **React 19** - Latest React with hooks
- 🔷 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS** - Modern styling
- 🗄️ **PGlite** - PostgreSQL in the browser via WebAssembly
- 🧬 **Drizzle ORM** - Type-safe database operations
- 🧪 **Vitest** - Unit testing
- 🐳 **Docker** - Multi-stage production build
- ☸️ **GitOps** - Argo CD managed deployment
- 💰 **FinOps** - Cost allocation via Kubecost labels

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  React UI    │  │   PGlite     │  │  localStorage│      │
│  │  (Game Board)│  │ (PostgreSQL  │  │(Player Names)│      │
│  │              │  │   in WASM)   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                    useGameWithDb Hook                       │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  IndexedDB   │    │   Games      │
            │  (PGlite     │    │   Table      │
            │   Storage)   │    │   (Drizzle)  │
            └──────────────┘    └──────────────┘
```

### Database Schema

```typescript
// games table schema
{
  id: serial('id').primaryKey(),
  playerX: varchar('player_x', { length: 50 }).notNull(),
  playerO: varchar('player_o', { length: 50 }).notNull(),
  winner: varchar('winner', { length: 50 }),  // null = draw
  boardState: jsonb('board_state').notNull(),
  moves: integer('moves').notNull(),
  createdAt: timestamp('created_at').defaultNow()
}
```

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
yarn build
docker build -t showcase-app-p1:local .

# Run container
docker run -p 8080:80 showcase-app-p1:local

# Test health endpoint
curl http://localhost:8080/health
```

### Loading to Kind Cluster

```bash
# Load image into Kind
kind load docker-image showcase-app-p1:local --name gitops-finops

# Restart deployment
kubectl rollout restart deployment dev-sample-app -n sample-app-dev
```

## GitOps Deployment

This app is deployed via Argo CD from the `gitops-cost-showcase` repository:

| Environment | Image Tag | Sync Strategy | Namespace |
|-------------|-----------|---------------|-----------|
| Dev | `showcase-app-p1:local` | kubectl apply | sample-app-dev |
| Prod | `showcase-app-p1:local` | kubectl apply | sample-app-prod |

### Argo CD Access
- URL: https://localhost:8080
- Username: `admin`
- Password: `finops@p1`

## FinOps Labels

All deployments include cost allocation labels for Kubecost tracking:

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
| `/` | Tic-Tac-Toe game UI |
| `/health` | Health check (returns "healthy") |

## Project Structure

```
sample-app/
├── src/
│   ├── components/          # React components
│   │   ├── Game.tsx        # Main game board
│   │   ├── PlayerSetup.tsx # Player name modal
│   │   ├── ScoreBoard.tsx  # Score display
│   │   └── GameHistory.tsx # Game history list
│   ├── db/
│   │   ├── schema.ts       # Drizzle schema definition
│   │   └── migrations/     # Database migrations
│   ├── hooks/
│   │   └── useGameWithDb.ts # Game state + DB persistence
│   ├── types.ts            # TypeScript types
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── Dockerfile              # Multi-stage build
├── package.json            # Node dependencies
├── REBUILD.md              # Quick rebuild guide
└── README.md               # This file
```

## Key Components

### `useGameWithDb` Hook

The core game logic hook that manages:
- Game state (board, current player, winner)
- PGlite database initialization
- Game history persistence
- Player name memory (localStorage)
- Score calculation from DB records

```typescript
const {
  board,           // Current board state
  currentPlayer,   // 'X' or 'O'
  winner,          // 'X', 'O', 'draw', or null
  playerX,         // Player X name
  playerO,         // Player O name
  gameHistory,     // Array of past games
  scores,          // { x: number, o: number, draws: number }
  previousPlayers, // { playerX, playerO } | null
  handleMove,      // (index: number) => void
  startGame,       // (playerX: string, playerO: string) => void
  resetGame,       // () => void
  resetAll         // () => void (clears scores)
} = useGameWithDb();
```

### Player Setup Modal

First-time users see a modal to enter player names:
- Names are validated (required, must be different)
- Previous players are suggested from localStorage
- "Play Again" button for quick rematches

## Data Persistence

### PGlite (PostgreSQL in Browser)

This app uses **PGlite** - a WebAssembly build of PostgreSQL that runs entirely in the browser:

- **Storage**: IndexedDB (persists across browser sessions)
- **ORM**: Drizzle ORM for type-safe queries
- **Schema**: Full PostgreSQL compatibility
- **No Backend Required**: Database runs client-side

### Player Name Memory

Player names are stored in two places:
1. **localStorage** - For quick pre-fill on new games
2. **PGlite Database** - Retrieved from last game if localStorage is empty

## Testing

```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test --watch
```

## Related Documentation

- [Rebuild Guide](./REBUILD.md) - Quick reference for rebuilding and redeploying
- [Argo CD Workflows](../docs/argocd-workflows/) - Managing deployments
- [Screenshots](../screenshots/) - Visual documentation

## Showcase Access

| Service | URL | Credentials |
|---------|-----|-------------|
| App (Dev) | http://localhost:8082 | - |
| Argo CD | https://localhost:8080 | admin / finops@p1 |
| Kubecost | http://localhost:9090 | - |

## License

MIT - Part of GitOps-FinOps showcase

<div align="center">

```
                      _                  _
  ___ _ __ ___  __ _| |_ ___        ___| | ___  __ _ _ __
 / __| '__/ _ \/ _` | __/ _ \_____ / __| |/ _ \/ _` | '_ \
| (__| | |  __/ (_| | ||  __/_____| (__| |  __/ (_| | | | |
 \___|_|  \___|\__,_|\__\___|      \___|_|\___|\__,_|_| |_|
```

### I copy-pasted the same boilerplate for every project. Never again.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?logo=go&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)

[![npm version](https://img.shields.io/npm/v/@cjarero183006/create-clean-app?style=flat-square&color=00d4ff)](https://www.npmjs.com/package/@cjarero183006/create-clean-app)
[![npm downloads](https://img.shields.io/npm/dm/@cjarero183006/create-clean-app?style=flat-square&color=7c3aed)](https://www.npmjs.com/package/@cjarero183006/create-clean-app)
[![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-40%20passed-brightgreen?style=flat-square)](package.json)

**Scaffold MCP servers and microservices with Clean Architecture**

[Quick Start](#quick-start) · [Templates](#templates) · [What You Get](#what-you-get) · [Architecture](#architecture)

</div>

---

## Why I Built This

Every new project started the same way:

1. Create folder structure (domain, application, infrastructure)
2. Copy configs from last project (tsconfig, Dockerfile, docker-compose)
3. Set up CI/CD workflow
4. Initialize Git Flow branches
5. Fix the things I forgot to copy

I automated all of it. Now I scaffold production-ready projects in seconds.

---

## Demo

```
┌  create-clean-app
│
◇  What do you want to create?
│  ● MCP Server
│  ○ Microservice / API
│
◇  Select your stack:
│  ● Go
│  ○ NestJS
│
◇  Project name:
│  my-mcp-server
│
◇  Description:
│  GitHub repository monitor
│
◇  Select features:
│  ◉ Git Flow (main + develop branches)
│  ◉ Docker (Dockerfile + docker-compose)
│  ◉ GitHub Actions (CI/CD workflow)
│
└  ✔ Project created successfully!
```

---

## Quick Start

```bash
# Run directly
npx @cjarero183006/create-clean-app

# Or with bun
bunx @cjarero183006/create-clean-app

# Or install globally
npm install -g @cjarero183006/create-clean-app
create-clean-app
```

Answer 5 questions. Get a complete project.

---

## Templates

### MCP Servers

| Stack | What you get |
|-------|--------------|
| **Go** | mcp-go SDK, stdio transport, Clean Architecture layers, Makefile |
| **NestJS** | @modelcontextprotocol/sdk, decorators, dependency injection, TypeScript |

### Microservices / APIs

| Stack | What you get |
|-------|--------------|
| **Go** | Chi router, REST endpoints, Clean Architecture, health checks |
| **NestJS** | Full NestJS setup, controllers, services, DTOs, validation |

---

## What You Get

Every template generates a production-ready structure:

```
my-project/
├── domain/                 # Entities & business rules
├── application/            # Use cases & ports
├── infrastructure/         # HTTP, MCP, DB adapters
├── Dockerfile              # Multi-stage build
├── docker-compose.yml      # Local development
├── Makefile                # build, run, test, lint
├── .github/workflows/      # CI pipeline
└── README.md               # Project docs
```

### Optional Features

| Feature | What it adds |
|---------|--------------|
| **Git Flow** | Initializes repo with `main` and `develop` branches |
| **Docker** | Multi-stage Dockerfile, docker-compose.yml with volumes |
| **GitHub Actions** | CI workflow with lint, test, build steps |

---

## Architecture

All templates follow Clean Architecture. Dependencies point inward.

```
┌─────────────────────────────────────────┐
│              Domain                      │
│       (Entities, Business Rules)         │
│       No external dependencies           │
├─────────────────────────────────────────┤
│            Application                   │
│         (Use Cases, Ports)               │
│       Orchestrates domain logic          │
├─────────────────────────────────────────┤
│           Infrastructure                 │
│       (HTTP, MCP, DB, External)          │
│       Implements ports (adapters)        │
└─────────────────────────────────────────┘
```

| Aspect | Choice |
|--------|--------|
| Architecture | Clean Architecture / Hexagonal |
| Testing | Vitest (40 passing) |
| Build | tsup (ESM) |
| CLI UI | @clack/prompts via cli-builder |

---

## Development

```bash
git clone https://github.com/jarero321/create-clean-app.git
cd create-clean-app
bun install
bun run dev
```

| Script | What it does |
|--------|--------------|
| `bun run dev` | Run CLI in development mode |
| `bun test` | Watch mode |
| `bun run test:run` | Single run |
| `bun run test:coverage` | Coverage report |
| `bun run build` | Production build |

---

## License

MIT

---

<div align="center">

**[Report Bug](https://github.com/jarero321/create-clean-app/issues)** · **[Request Feature](https://github.com/jarero321/create-clean-app/issues)**

</div>

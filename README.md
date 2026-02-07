<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,5,30&height=180&section=header&text=create-clean-app&fontSize=36&fontColor=fff&animation=fadeIn&fontAlignY=32" />

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Tests](https://img.shields.io/badge/tests-40%20passed-brightgreen?style=for-the-badge)
![License](https://img.shields.io/github/license/jarero321/create-clean-app?style=for-the-badge)

**Scaffold MCP servers and microservices with Clean Architecture in seconds.**

<a href="https://www.npmjs.com/package/@cjarero183006/create-clean-app">
  <img src="https://img.shields.io/npm/v/@cjarero183006/create-clean-app?style=for-the-badge&color=00d4ff&logo=npm&logoColor=white&label=npm" alt="npm" />
</a>
<a href="https://github.com/jarero321/create-clean-app">
  <img src="https://img.shields.io/badge/CODE-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="code" />
</a>

[Quick Start](#quick-start) •
[Templates](#templates) •
[What You Get](#what-you-get) •
[Architecture](#architecture)

</div>

---

## Features

| Feature | Description |
|:--------|:------------|
| **4 Templates** | MCP Go, MCP NestJS, API Go, API NestJS |
| **Clean Architecture** | Domain, Application, Infrastructure layers in every template |
| **Git Flow** | Optional `main` + `develop` branch initialization |
| **Docker** | Optional multi-stage Dockerfile + docker-compose |
| **GitHub Actions** | Optional CI workflow with lint, test, build |
| **Interactive CLI** | Guided prompts via @clack/prompts + cli-builder |
| **40 Tests** | Full coverage with Vitest |
| **Single Dependency** | Built on @cjarero183006/cli-builder |

## Tech Stack

<div align="center">

**Languages & Frameworks**

<img src="https://skillicons.dev/icons?i=ts,go,nestjs,nodejs,bun&perline=8" alt="languages" />

**Infrastructure & Tools**

<img src="https://skillicons.dev/icons?i=docker,githubactions,npm&perline=8" alt="infra" />

</div>

## Why I Built This

Every new project started the same way:

1. Create folder structure (domain, application, infrastructure)
2. Copy configs from last project (tsconfig, Dockerfile, docker-compose)
3. Set up CI/CD workflow
4. Initialize Git Flow branches
5. Fix the things I forgot to copy

I automated all of it. Now I scaffold production-ready projects in seconds.

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

## Templates

### MCP Servers

| Stack | What You Get |
|:------|:-------------|
| **Go** | mcp-go SDK, stdio transport, Clean Architecture layers, Makefile |
| **NestJS** | @modelcontextprotocol/sdk, decorators, dependency injection, TypeScript |

### Microservices / APIs

| Stack | What You Get |
|:------|:-------------|
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

| Feature | What It Adds |
|:--------|:-------------|
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
|:-------|:-------|
| **Architecture** | Clean Architecture / Hexagonal |
| **Testing** | Vitest (40 passing) |
| **Build** | tsup (ESM) |
| **CLI UI** | @clack/prompts via cli-builder |

---

## Development

```bash
git clone https://github.com/jarero321/create-clean-app.git
cd create-clean-app
bun install
bun run dev
```

| Script | Description |
|:-------|:------------|
| `bun run dev` | Run CLI in development mode |
| `bun test` | Watch mode |
| `bun run test:run` | Single run |
| `bun run test:coverage` | Coverage report |
| `bun run build` | Production build |

---

## Used By

<table>
<tr>
<td align="center" width="50%">
<a href="https://github.com/jarero321/mcp-repo-monitor">
<img src="https://img.shields.io/badge/mcp--repo--monitor-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="mcp-repo-monitor" />
</a>
<br /><sub>Go MCP server scaffolded with this tool</sub>
</td>
<td align="center" width="50%">
<a href="https://github.com/jarero321/mcp-obsidian-planner">
<img src="https://img.shields.io/badge/mcp--obsidian--planner-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="mcp-obsidian-planner" />
</a>
<br /><sub>NestJS MCP server scaffolded with this tool</sub>
</td>
</tr>
<tr>
<td align="center" width="50%">
<a href="https://github.com/jarero321/transaction-events-api">
<img src="https://img.shields.io/badge/transaction--events--api-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="transaction-events-api" />
</a>
<br /><sub>NestJS API scaffolded with this tool</sub>
</td>
<td align="center" width="50%">
<a href="https://github.com/jarero321/create-clean-app">
<img src="https://img.shields.io/badge/your_project-7c3aed?style=for-the-badge&logo=github&logoColor=white" alt="your project" />
</a>
<br /><sub>npx @cjarero183006/create-clean-app</sub>
</td>
</tr>
</table>

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[Report Bug](https://github.com/jarero321/create-clean-app/issues)** · **[Request Feature](https://github.com/jarero321/create-clean-app/issues)**

</div>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,5,30&height=120&section=footer" />

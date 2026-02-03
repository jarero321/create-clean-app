# create-clean-app

CLI for scaffolding projects with Clean Architecture.

## Installation

```bash
bun install
bun link
```

## Usage

```bash
create-clean-app
```

## Available Templates

| Type | Stack | Description |
|------|-------|-------------|
| MCP Server | Go | Model Context Protocol for LLMs |
| Microservice | Go | REST API with Chi router |
| Microservice | NestJS | REST API with TypeScript & DI |

## Features

- **Git Flow** - Initialize with main/develop branches
- **Docker** - Dockerfile and docker-compose (coming soon)
- **GitHub Actions** - CI/CD workflow (coming soon)

## Architecture

All templates follow Clean Architecture:

```
├── domain/           # Entities & business logic
├── application/      # Use cases & ports (interfaces)
└── infrastructure/   # Adapters (HTTP, MCP, DB, etc.)
```

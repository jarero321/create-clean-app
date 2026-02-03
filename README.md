<div align="center">

# create-clean-app

![Build](https://img.shields.io/github/actions/workflow/status/jarero321/create-clean-app/ci.yml?branch=main)
![Version](https://img.shields.io/npm/v/@cjarero183006/create-clean-app)
![License](https://img.shields.io/github/license/jarero321/create-clean-app)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

**CLI for scaffolding projects with Clean Architecture**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?logo=go&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)

[Installation](#installation) •
[Usage](#usage) •
[Templates](#available-templates) •
[Contributing](#contributing)

</div>

---

## Features

| Feature | Description |
|---------|-------------|
| Clean Architecture | All templates follow domain-driven design with clear separation of concerns |
| Multiple Stacks | Support for Go and NestJS (TypeScript) |
| Git Flow | Optional initialization with main/develop branches |
| Docker Support | Add Dockerfile and docker-compose to your project |
| GitHub Actions | Add CI/CD workflow for automated testing and deployment |

## Installation

### Using npx (recommended)

```bash
npx @cjarero183006/create-clean-app
```

### Using Bun

```bash
bunx @cjarero183006/create-clean-app
```

### Global installation

```bash
npm install -g @cjarero183006/create-clean-app
create-clean-app
```

## Usage

Run the CLI and follow the interactive prompts:

```bash
create-clean-app
```

The CLI will guide you through:

1. **Project type** - MCP Server or Microservice/API
2. **Stack selection** - Go or NestJS
3. **Project name** - Your project's name (lowercase, hyphens allowed)
4. **Description** - Brief description of your project
5. **Features** - Git Flow, Docker, GitHub Actions

## Available Templates

| Type | Stack | Description |
|------|-------|-------------|
| MCP Server | Go | Model Context Protocol server using mcp-go SDK |
| MCP Server | NestJS | MCP server with @modelcontextprotocol/sdk |
| Microservice | Go | REST API with Chi router |
| Microservice | NestJS | REST API with TypeScript, decorators & DI |

## Project Structure

All generated projects follow Clean Architecture principles:

```
my-project/
├── domain/           # Entities & business logic
├── application/      # Use cases & ports (interfaces)
└── infrastructure/   # Adapters (HTTP, MCP, DB, etc.)
```

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- Node.js >= 18

### Setup

```bash
# Clone the repository
git clone https://github.com/jarero321/create-clean-app.git
cd create-clean-app

# Install dependencies
bun install

# Run in development
bun run dev

# Run tests
bun test

# Build for production
bun run build
```

### Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Run CLI in development mode |
| `bun test` | Run tests in watch mode |
| `bun run test:run` | Run tests once |
| `bun run test:coverage` | Run tests with coverage |
| `bun run build` | Build for production |

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

Made with :heart: by [Carlos](https://github.com/jarero321)

</div>

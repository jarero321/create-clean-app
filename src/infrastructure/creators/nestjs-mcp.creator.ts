import type { ProjectConfig, ProjectCreator } from "../../domain/interfaces";

export class NestJSMCPCreator implements ProjectCreator {
  readonly type = "mcp";
  readonly stack = "nestjs";
  readonly installCommand = "npm install";
  readonly nextSteps = "npm run inspect";

  getTemplates(config: ProjectConfig): Record<string, string> {
    return {
      "package.json": `{
  "name": "${config.name}",
  "version": "1.0.0",
  "description": "${config.description}",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:stdio": "node dist/main.js",
    "start:sse": "node dist/main.js --sse",
    "inspect": "npx @modelcontextprotocol/inspector node dist/main.js",
    "lint": "eslint \\"{src,test}/**/*.ts\\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^22.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^10.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "ts-jest": "^29.2.0",
    "ts-loader": "^9.5.0",
    "ts-node": "^10.9.0",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.0"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\\\.spec\\\\.ts$",
    "transform": {
      "^.+\\\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^@domain/(.*)$": "<rootDir>/domain/$1",
      "^@application/(.*)$": "<rootDir>/application/$1",
      "^@infrastructure/(.*)$": "<rootDir>/infrastructure/$1"
    }
  }
}
`,

      "tsconfig.json": `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@application/*": ["src/application/*"],
      "@infrastructure/*": ["src/infrastructure/*"]
    }
  }
}
`,

      "tsconfig.build.json": `{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
`,

      "nest-cli.json": `{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
`,

      ".gitignore": `node_modules/
dist/
.env
.env.*
!.env.example
coverage/
.idea/
.vscode/
*.log
.DS_Store
`,

      ".prettierrc": `{
  "singleQuote": true,
  "trailingComma": "all"
}
`,

      "README.md": `# ${config.name}

${config.description}

## Architecture

\`\`\`
src/
├── domain/              # Business logic & entities
│   ├── entities/
│   └── services/
├── application/         # Use cases & ports
│   ├── ports/
│   └── use-cases/
└── infrastructure/      # External interfaces
    └── mcp/
        ├── handlers/
        └── server/
\`\`\`

## Usage

\`\`\`bash
npm install       # Install dependencies
npm run build     # Build the project
npm run inspect   # Open MCP Inspector UI
npm run start:stdio  # Run in stdio mode (for Claude Desktop)
npm run start:sse    # Run in SSE mode (for HTTP clients)
\`\`\`

## Claude Desktop Configuration

Add to your Claude Desktop config (\`~/.config/claude/claude_desktop_config.json\`):

\`\`\`json
{
  "mcpServers": {
    "${config.name}": {
      "command": "node",
      "args": ["path/to/${config.name}/dist/main.js"]
    }
  }
}
\`\`\`

## Tools

- \`process\` - Process input data and return a result
`,

      "src/main.ts": `import { NestFactory } from '@nestjs/core';
import { McpModule } from '@infrastructure/mcp/mcp.module';
import { McpServer } from '@infrastructure/mcp/mcp.server';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(McpModule);
  const mcpServer = app.get(McpServer);

  const mode = process.argv.includes('--sse') ? 'sse' : 'stdio';
  const port = parseInt(process.env.PORT || '3000', 10);

  if (mode === 'stdio') {
    await mcpServer.serveStdio();
  } else {
    await mcpServer.serveSSE(port);
  }
}

bootstrap();
`,

      "src/domain/entities/input.entity.ts": `export class Input {
  constructor(public readonly data: string) {}
}
`,

      "src/domain/entities/result.entity.ts": `import { randomUUID } from 'crypto';

export class Result {
  public readonly id: string;

  constructor(public readonly output: string) {
    this.id = randomUUID();
  }
}
`,

      "src/domain/entities/index.ts": `export * from './input.entity';
export * from './result.entity';
`,

      "src/domain/services/process.service.ts": `import { Injectable } from '@nestjs/common';
import { Input, Result } from '@domain/entities';

@Injectable()
export class ProcessService {
  process(input: Input): Result {
    return new Result(\`Processed: \${input.data}\`);
  }
}
`,

      "src/domain/services/index.ts": `export * from './process.service';
`,

      "src/application/ports/process.port.ts": `import { Input, Result } from '@domain/entities';

export interface ProcessPort {
  process(input: Input): Result;
}

export const PROCESS_PORT = Symbol('PROCESS_PORT');
`,

      "src/application/ports/index.ts": `export * from './process.port';
`,

      "src/application/use-cases/process.use-case.ts": `import { Inject, Injectable } from '@nestjs/common';
import { Input, Result } from '@domain/entities';
import { PROCESS_PORT, ProcessPort } from '@application/ports';

@Injectable()
export class ProcessUseCase {
  constructor(
    @Inject(PROCESS_PORT)
    private readonly processPort: ProcessPort,
  ) {}

  execute(input: Input): Result {
    return this.processPort.process(input);
  }
}
`,

      "src/application/use-cases/index.ts": `export * from './process.use-case';
`,

      "src/infrastructure/mcp/handlers/process.handler.ts": `import { Injectable } from '@nestjs/common';
import { Input } from '@domain/entities';
import { ProcessUseCase } from '@application/use-cases';
import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';

@Injectable()
export class ProcessHandler {
  constructor(private readonly processUseCase: ProcessUseCase) {}

  async handle(data: string): Promise<CallToolResult> {
    const input = new Input(data);
    const result = this.processUseCase.execute(input);

    const content: TextContent = {
      type: 'text',
      text: \`ID: \${result.id}\\nOutput: \${result.output}\`,
    };

    return {
      content: [content],
    };
  }
}
`,

      "src/infrastructure/mcp/handlers/index.ts": `export * from './process.handler';
`,

      "src/infrastructure/mcp/mcp.server.ts": `import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ProcessHandler } from './handlers';
import { createServer, IncomingMessage, ServerResponse } from 'http';

@Injectable()
export class McpServer implements OnModuleInit {
  private server: Server;

  constructor(private readonly processHandler: ProcessHandler) {
    this.server = new Server(
      {
        name: '${config.name}',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );
  }

  onModuleInit() {
    this.registerTools();
  }

  private registerTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'process',
          description: 'Process input data and return a result',
          inputSchema: {
            type: 'object',
            properties: {
              data: {
                type: 'string',
                description: 'Input data to process',
              },
            },
            required: ['data'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'process') {
        const data = (args as { data: string }).data;
        return this.processHandler.handle(data);
      }

      throw new Error(\`Unknown tool: \${name}\`);
    });
  }

  async serveStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async serveSSE(port: number): Promise<void> {
    const transports = new Map<string, SSEServerTransport>();

    const httpServer = createServer(
      async (req: IncomingMessage, res: ServerResponse) => {
        const url = new URL(req.url || '', \`http://localhost:\${port}\`);

        if (url.pathname === '/sse') {
          const transport = new SSEServerTransport('/messages', res);
          const sessionId = Math.random().toString(36).substring(7);
          transports.set(sessionId, transport);

          res.on('close', () => {
            transports.delete(sessionId);
          });

          await this.server.connect(transport);
        } else if (url.pathname === '/messages' && req.method === 'POST') {
          const sessionId = url.searchParams.get('sessionId');
          const transport = sessionId ? transports.get(sessionId) : undefined;

          if (transport) {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', async () => {
              await transport.handlePostMessage(req, res, body);
            });
          } else {
            res.writeHead(404);
            res.end('Session not found');
          }
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      },
    );

    httpServer.listen(port, () => {
      console.log(\`SSE Server running on http://localhost:\${port}/sse\`);
    });
  }
}
`,

      "src/infrastructure/mcp/mcp.module.ts": `import { Module } from '@nestjs/common';
import { ProcessService } from '@domain/services';
import { PROCESS_PORT } from '@application/ports';
import { ProcessUseCase } from '@application/use-cases';
import { ProcessHandler } from './handlers';
import { McpServer } from './mcp.server';

@Module({
  providers: [
    ProcessService,
    {
      provide: PROCESS_PORT,
      useExisting: ProcessService,
    },
    ProcessUseCase,
    ProcessHandler,
    McpServer,
  ],
  exports: [McpServer],
})
export class McpModule {}
`,

      "src/infrastructure/mcp/index.ts": `export * from './mcp.module';
export * from './mcp.server';
export * from './handlers';
`,
    };
  }
}

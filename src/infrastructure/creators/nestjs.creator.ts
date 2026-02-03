import type { ProjectConfig, ProjectCreator } from "../../domain/interfaces";

export class NestJSCreator implements ProjectCreator {
  readonly type = "microservice";
  readonly stack = "nestjs";
  readonly installCommand = "npm install";
  readonly nextSteps = "npm run start:dev";

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
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \\"{src,test}/**/*.ts\\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
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
    └── http/
        ├── controllers/
        └── dtos/
\`\`\`

## Usage

\`\`\`bash
npm install       # Install dependencies
npm run start:dev # Run in development mode
npm run build     # Build for production
npm run start:prod # Run in production mode
\`\`\`

## Endpoints

- \`GET /health\` - Health check
- \`POST /api/v1/process\` - Process data
`,

      "src/main.ts": `import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@infrastructure/http/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(\`Server running on http://localhost:\${port}\`);
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

      "src/infrastructure/http/dtos/process.dto.ts": `import { IsNotEmpty, IsString } from 'class-validator';

export class ProcessRequestDto {
  @IsString()
  @IsNotEmpty()
  data: string;
}

export class ProcessResponseDto {
  id: string;
  output: string;
}
`,

      "src/infrastructure/http/dtos/index.ts": `export * from './process.dto';
`,

      "src/infrastructure/http/controllers/health.controller.ts": `import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
`,

      "src/infrastructure/http/controllers/process.controller.ts": `import { Body, Controller, Post } from '@nestjs/common';
import { Input } from '@domain/entities';
import { ProcessUseCase } from '@application/use-cases';
import { ProcessRequestDto, ProcessResponseDto } from '../dtos';

@Controller('api/v1')
export class ProcessController {
  constructor(private readonly processUseCase: ProcessUseCase) {}

  @Post('process')
  process(@Body() dto: ProcessRequestDto): ProcessResponseDto {
    const input = new Input(dto.data);
    const result = this.processUseCase.execute(input);

    return {
      id: result.id,
      output: result.output,
    };
  }
}
`,

      "src/infrastructure/http/controllers/index.ts": `export * from './health.controller';
export * from './process.controller';
`,

      "src/infrastructure/http/app.module.ts": `import { Module } from '@nestjs/common';
import { ProcessService } from '@domain/services';
import { PROCESS_PORT } from '@application/ports';
import { ProcessUseCase } from '@application/use-cases';
import { HealthController, ProcessController } from './controllers';

@Module({
  controllers: [HealthController, ProcessController],
  providers: [
    ProcessService,
    {
      provide: PROCESS_PORT,
      useExisting: ProcessService,
    },
    ProcessUseCase,
  ],
})
export class AppModule {}
`,
    };
  }
}

import { describe, it, expect } from "vitest";
import { NestJSCreator } from "../../../infrastructure/creators";

describe("NestJSCreator", () => {
  const creator = new NestJSCreator();

  it("should have correct metadata", () => {
    expect(creator.type).toBe("microservice");
    expect(creator.stack).toBe("nestjs");
    expect(creator.installCommand).toBe("npm install");
    expect(creator.nextSteps).toBe("npm run start:dev");
  });

  it("should generate templates with project name", () => {
    const config = {
      name: "my-nest-api",
      description: "My NestJS API",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const packageJson = JSON.parse(templates["package.json"]);

    expect(packageJson.name).toBe("my-nest-api");
    expect(packageJson.description).toBe("My NestJS API");
    expect(templates["README.md"]).toContain("# my-nest-api");
  });

  it("should include NestJS dependencies", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const packageJson = JSON.parse(templates["package.json"]);

    expect(packageJson.dependencies["@nestjs/common"]).toBeDefined();
    expect(packageJson.dependencies["@nestjs/core"]).toBeDefined();
    expect(packageJson.dependencies["class-validator"]).toBeDefined();
    expect(packageJson.dependencies["class-transformer"]).toBeDefined();
  });

  it("should generate TypeScript clean architecture structure", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const files = Object.keys(templates);

    expect(files).toContain("src/domain/entities/input.entity.ts");
    expect(files).toContain("src/domain/entities/result.entity.ts");
    expect(files).toContain("src/domain/services/process.service.ts");
    expect(files).toContain("src/application/ports/process.port.ts");
    expect(files).toContain("src/application/use-cases/process.use-case.ts");
    expect(files).toContain("src/infrastructure/http/controllers/process.controller.ts");
    expect(files).toContain("src/infrastructure/http/dtos/process.dto.ts");
  });

  it("should configure path aliases for clean architecture", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const tsconfig = JSON.parse(templates["tsconfig.json"]);

    expect(tsconfig.compilerOptions.paths["@domain/*"]).toEqual(["src/domain/*"]);
    expect(tsconfig.compilerOptions.paths["@application/*"]).toEqual(["src/application/*"]);
    expect(tsconfig.compilerOptions.paths["@infrastructure/*"]).toEqual(["src/infrastructure/*"]);
  });

  it("should use dependency injection with ports", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);

    expect(templates["src/application/ports/process.port.ts"]).toContain("interface ProcessPort");
    expect(templates["src/application/ports/process.port.ts"]).toContain("PROCESS_PORT = Symbol");
    expect(templates["src/application/use-cases/process.use-case.ts"]).toContain("@Inject(PROCESS_PORT)");
    expect(templates["src/infrastructure/http/app.module.ts"]).toContain("provide: PROCESS_PORT");
  });
});

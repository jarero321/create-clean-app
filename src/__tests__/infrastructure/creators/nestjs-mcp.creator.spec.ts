import { describe, it, expect } from "vitest";
import { NestJSMCPCreator } from "../../../infrastructure/creators";

describe("NestJSMCPCreator", () => {
  const creator = new NestJSMCPCreator();

  it("should have correct metadata", () => {
    expect(creator.type).toBe("mcp");
    expect(creator.stack).toBe("nestjs");
    expect(creator.installCommand).toBe("npm install");
    expect(creator.nextSteps).toBe("npm run inspect");
  });

  it("should generate templates with project name", () => {
    const config = {
      name: "my-mcp-server",
      description: "My MCP Server",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const packageJson = JSON.parse(templates["package.json"]);

    expect(packageJson.name).toBe("my-mcp-server");
    expect(packageJson.description).toBe("My MCP Server");
    expect(templates["README.md"]).toContain("# my-mcp-server");
  });

  it("should include MCP SDK and NestJS dependencies", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const packageJson = JSON.parse(templates["package.json"]);

    expect(packageJson.dependencies["@modelcontextprotocol/sdk"]).toBeDefined();
    expect(packageJson.dependencies["@nestjs/common"]).toBeDefined();
    expect(packageJson.dependencies["@nestjs/core"]).toBeDefined();
    expect(packageJson.dependencies["reflect-metadata"]).toBeDefined();
  });

  it("should not include HTTP platform dependencies", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const packageJson = JSON.parse(templates["package.json"]);

    expect(packageJson.dependencies["@nestjs/platform-express"]).toBeUndefined();
    expect(packageJson.dependencies["class-validator"]).toBeUndefined();
    expect(packageJson.dependencies["class-transformer"]).toBeUndefined();
  });

  it("should generate TypeScript clean architecture structure for MCP", () => {
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
    expect(files).toContain("src/infrastructure/mcp/mcp.module.ts");
    expect(files).toContain("src/infrastructure/mcp/mcp.server.ts");
    expect(files).toContain("src/infrastructure/mcp/handlers/process.handler.ts");
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
    expect(templates["src/infrastructure/mcp/mcp.module.ts"]).toContain("provide: PROCESS_PORT");
  });

  it("should generate MCP server with tool registration", () => {
    const config = {
      name: "test-server",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const mcpServer = templates["src/infrastructure/mcp/mcp.server.ts"];

    expect(mcpServer).toContain("@modelcontextprotocol/sdk");
    expect(mcpServer).toContain("ListToolsRequestSchema");
    expect(mcpServer).toContain("CallToolRequestSchema");
    expect(mcpServer).toContain("name: 'process'");
    expect(mcpServer).toContain("serveStdio");
    expect(mcpServer).toContain("serveSSE");
  });

  it("should include MCP inspect script", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const packageJson = JSON.parse(templates["package.json"]);

    expect(packageJson.scripts.inspect).toContain("@modelcontextprotocol/inspector");
    expect(packageJson.scripts["start:stdio"]).toBe("node dist/main.js");
    expect(packageJson.scripts["start:sse"]).toBe("node dist/main.js --sse");
  });

  it("should generate main.ts with stdio and sse modes", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const mainTs = templates["src/main.ts"];

    expect(mainTs).toContain("NestFactory.createApplicationContext");
    expect(mainTs).toContain("McpModule");
    expect(mainTs).toContain("mcpServer.serveStdio()");
    expect(mainTs).toContain("mcpServer.serveSSE(port)");
    expect(mainTs).toContain("process.argv.includes('--sse')");
  });

  it("should generate README with Claude Desktop configuration", () => {
    const config = {
      name: "my-server",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const readme = templates["README.md"];

    expect(readme).toContain("Claude Desktop Configuration");
    expect(readme).toContain("claude_desktop_config.json");
    expect(readme).toContain("my-server");
  });
});

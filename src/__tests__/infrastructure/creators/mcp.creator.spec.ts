import { describe, it, expect } from "vitest";
import { MCPCreator } from "../../../infrastructure/creators";

describe("MCPCreator", () => {
  const creator = new MCPCreator();

  it("should have correct metadata", () => {
    expect(creator.type).toBe("mcp");
    expect(creator.stack).toBe("go");
    expect(creator.installCommand).toBe("go mod tidy");
    expect(creator.nextSteps).toBe("make inspect");
  });

  it("should generate templates with project name", () => {
    const config = {
      name: "my-mcp-server",
      description: "My MCP Server",
      features: [],
    };

    const templates = creator.getTemplates(config);

    expect(templates["go.mod"]).toContain("github.com/carlos/my-mcp-server");
    expect(templates["README.md"]).toContain("# my-mcp-server");
    expect(templates["README.md"]).toContain("My MCP Server");
    expect(templates["Makefile"]).toContain("BINARY_NAME=my-mcp-server");
  });

  it("should generate all required files", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const files = Object.keys(templates);

    expect(files).toContain("go.mod");
    expect(files).toContain(".gitignore");
    expect(files).toContain("Makefile");
    expect(files).toContain("README.md");
    expect(files).toContain("cmd/server/main.go");
    expect(files).toContain("internal/domain/entity/entity.go");
    expect(files).toContain("internal/domain/service/service.go");
    expect(files).toContain("internal/application/port/port.go");
    expect(files).toContain("internal/application/usecase/usecase.go");
    expect(files).toContain("internal/infrastructure/mcp/handler.go");
    expect(files).toContain("internal/infrastructure/mcp/server.go");
    expect(files).toContain("internal/infrastructure/mcp/presenter.go");
  });

  it("should follow clean architecture structure", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);

    expect(templates["internal/domain/entity/entity.go"]).toContain("package entity");
    expect(templates["internal/domain/service/service.go"]).toContain("package service");
    expect(templates["internal/application/port/port.go"]).toContain("interface");
    expect(templates["internal/application/usecase/usecase.go"]).toContain("port.ServicePort");
  });
});

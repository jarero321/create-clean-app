import { describe, it, expect } from "vitest";
import { CreatorRegistry } from "../../../infrastructure/creators";

describe("CreatorRegistry", () => {
  it("should register all creators on initialization", () => {
    const registry = new CreatorRegistry();
    const creators = registry.getAll();

    expect(creators).toHaveLength(4);
  });

  it("should get creator by type and stack", () => {
    const registry = new CreatorRegistry();

    const mcpCreator = registry.get("mcp", "go");
    expect(mcpCreator).toBeDefined();
    expect(mcpCreator?.type).toBe("mcp");
    expect(mcpCreator?.stack).toBe("go");

    const goApiCreator = registry.get("microservice", "go");
    expect(goApiCreator).toBeDefined();
    expect(goApiCreator?.type).toBe("microservice");
    expect(goApiCreator?.stack).toBe("go");

    const nestjsCreator = registry.get("microservice", "nestjs");
    expect(nestjsCreator).toBeDefined();
    expect(nestjsCreator?.type).toBe("microservice");
    expect(nestjsCreator?.stack).toBe("nestjs");

    const nestjsMcpCreator = registry.get("mcp", "nestjs");
    expect(nestjsMcpCreator).toBeDefined();
    expect(nestjsMcpCreator?.type).toBe("mcp");
    expect(nestjsMcpCreator?.stack).toBe("nestjs");
  });

  it("should return undefined for non-existent creator", () => {
    const registry = new CreatorRegistry();

    const creator = registry.get("unknown", "unknown");
    expect(creator).toBeUndefined();
  });

  it("should get all creators by type", () => {
    const registry = new CreatorRegistry();

    const microserviceCreators = registry.getByType("microservice");
    expect(microserviceCreators).toHaveLength(2);
    expect(microserviceCreators.map((c) => c.stack)).toContain("go");
    expect(microserviceCreators.map((c) => c.stack)).toContain("nestjs");

    const mcpCreators = registry.getByType("mcp");
    expect(mcpCreators).toHaveLength(2);
    expect(mcpCreators.map((c) => c.stack)).toContain("go");
    expect(mcpCreators.map((c) => c.stack)).toContain("nestjs");
  });
});

import { describe, it, expect } from "vitest";
import { CreatorRegistry } from "../../../infrastructure/creators";

describe("CreatorRegistry", () => {
  it("should register all creators on initialization", () => {
    const registry = new CreatorRegistry();
    const creators = registry.getAll();

    expect(creators).toHaveLength(3);
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
    expect(mcpCreators).toHaveLength(1);
    expect(mcpCreators[0].stack).toBe("go");
  });
});

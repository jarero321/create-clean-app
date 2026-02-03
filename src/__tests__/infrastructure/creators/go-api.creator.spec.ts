import { describe, it, expect } from "vitest";
import { GoAPICreator } from "../../../infrastructure/creators";

describe("GoAPICreator", () => {
  const creator = new GoAPICreator();

  it("should have correct metadata", () => {
    expect(creator.type).toBe("microservice");
    expect(creator.stack).toBe("go");
    expect(creator.installCommand).toBe("go mod tidy");
    expect(creator.nextSteps).toBe("make run");
  });

  it("should generate templates with project name", () => {
    const config = {
      name: "my-api",
      description: "My REST API",
      features: [],
    };

    const templates = creator.getTemplates(config);

    expect(templates["go.mod"]).toContain("github.com/carlos/my-api");
    expect(templates["README.md"]).toContain("# my-api");
    expect(templates["README.md"]).toContain("My REST API");
  });

  it("should include chi router dependency", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);

    expect(templates["go.mod"]).toContain("github.com/go-chi/chi/v5");
    expect(templates["internal/infrastructure/http/router.go"]).toContain("chi.NewRouter");
  });

  it("should generate HTTP infrastructure instead of MCP", () => {
    const config = {
      name: "test",
      description: "",
      features: [],
    };

    const templates = creator.getTemplates(config);
    const files = Object.keys(templates);

    expect(files).toContain("internal/infrastructure/http/handler.go");
    expect(files).toContain("internal/infrastructure/http/router.go");
    expect(files).not.toContain("internal/infrastructure/mcp/server.go");
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FileServiceImpl } from "../../../infrastructure/services";
import { mkdir, writeFile, rm } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

describe("FileServiceImpl", () => {
  const testDir = "/tmp/create-clean-app-test-" + Date.now();
  let fileService: FileServiceImpl;

  beforeEach(async () => {
    fileService = new FileServiceImpl();
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("should create files with content", async () => {
    const files = {
      "test.txt": "Hello World",
      "config.json": '{"key": "value"}',
    };

    await fileService.createProjectStructure(testDir, files);

    const { readFile } = await import("fs/promises");
    const testContent = await readFile(join(testDir, "test.txt"), "utf-8");
    const configContent = await readFile(join(testDir, "config.json"), "utf-8");

    expect(testContent).toBe("Hello World");
    expect(configContent).toBe('{"key": "value"}');
  });

  it("should create nested directories", async () => {
    const files = {
      "src/domain/entity/user.ts": "export class User {}",
      "src/infrastructure/http/handler.ts": "export class Handler {}",
    };

    await fileService.createProjectStructure(testDir, files);

    expect(existsSync(join(testDir, "src/domain/entity/user.ts"))).toBe(true);
    expect(existsSync(join(testDir, "src/infrastructure/http/handler.ts"))).toBe(true);
  });

  it("should handle empty files object", async () => {
    await fileService.createProjectStructure(testDir, {});
    expect(existsSync(testDir)).toBe(true);
  });
});

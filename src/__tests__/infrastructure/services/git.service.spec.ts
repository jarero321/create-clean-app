import { describe, it, expect, vi, beforeEach } from "vitest";
import { GitServiceImpl } from "../../../infrastructure/services";
import type { ShellService } from "../../../domain/interfaces";

describe("GitServiceImpl", () => {
  let shellService: ShellService;
  let gitService: GitServiceImpl;

  beforeEach(() => {
    shellService = {
      run: vi.fn().mockResolvedValue(undefined),
    };
    gitService = new GitServiceImpl(shellService);
  });

  it("should execute git commands in correct order", async () => {
    const projectPath = "/tmp/test-project";

    await gitService.initGitFlow(projectPath);

    expect(shellService.run).toHaveBeenCalledTimes(5);
    expect(shellService.run).toHaveBeenNthCalledWith(1, "git init", projectPath);
    expect(shellService.run).toHaveBeenNthCalledWith(2, "git add .", projectPath);
    expect(shellService.run).toHaveBeenNthCalledWith(3, 'git commit -m "chore: initial project setup"', projectPath);
    expect(shellService.run).toHaveBeenNthCalledWith(4, "git branch -m main", projectPath);
    expect(shellService.run).toHaveBeenNthCalledWith(5, "git checkout -b develop", projectPath);
  });

  it("should propagate shell service errors", async () => {
    const error = new Error("Git command failed");
    shellService.run = vi.fn().mockRejectedValue(error);

    await expect(gitService.initGitFlow("/tmp/test")).rejects.toThrow("Git command failed");
  });
});

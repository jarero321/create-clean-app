import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateProjectUseCase, ProgressReporter } from "../../application/use-cases";
import type { FileService, GitService, ShellService, ProjectCreator, ProjectConfig } from "../../domain/interfaces";

describe("CreateProjectUseCase", () => {
  let fileService: FileService;
  let gitService: GitService;
  let shellService: ShellService;
  let progress: ProgressReporter;
  let useCase: CreateProjectUseCase;

  beforeEach(() => {
    fileService = {
      createProjectStructure: vi.fn().mockResolvedValue(undefined),
    };

    gitService = {
      initGitFlow: vi.fn().mockResolvedValue(undefined),
    };

    shellService = {
      run: vi.fn().mockResolvedValue(undefined),
    };

    progress = {
      start: vi.fn(),
      stop: vi.fn(),
    };

    useCase = new CreateProjectUseCase(fileService, gitService, shellService);
  });

  it("should create project structure", async () => {
    const creator: ProjectCreator = {
      type: "microservice",
      stack: "go",
      installCommand: "go mod tidy",
      nextSteps: "make run",
      getTemplates: () => ({ "main.go": "package main" }),
    };

    const config: ProjectConfig = {
      name: "test-project",
      description: "Test description",
      features: [],
    };

    await useCase.execute(creator, config, progress);

    expect(fileService.createProjectStructure).toHaveBeenCalledWith(
      expect.stringContaining("test-project"),
      { "main.go": "package main" }
    );
  });

  it("should install dependencies", async () => {
    const creator: ProjectCreator = {
      type: "microservice",
      stack: "nestjs",
      installCommand: "npm install",
      nextSteps: "npm run start:dev",
      getTemplates: () => ({}),
    };

    const config: ProjectConfig = {
      name: "test-project",
      description: "",
      features: [],
    };

    await useCase.execute(creator, config, progress);

    expect(shellService.run).toHaveBeenCalledWith(
      "npm install",
      expect.stringContaining("test-project")
    );
  });

  it("should initialize git flow when feature is enabled", async () => {
    const creator: ProjectCreator = {
      type: "mcp",
      stack: "go",
      installCommand: "go mod tidy",
      nextSteps: "make inspect",
      getTemplates: () => ({}),
    };

    const config: ProjectConfig = {
      name: "test-project",
      description: "",
      features: ["gitflow"],
    };

    await useCase.execute(creator, config, progress);

    expect(gitService.initGitFlow).toHaveBeenCalledWith(
      expect.stringContaining("test-project")
    );
  });

  it("should NOT initialize git flow when feature is disabled", async () => {
    const creator: ProjectCreator = {
      type: "mcp",
      stack: "go",
      installCommand: "go mod tidy",
      nextSteps: "make inspect",
      getTemplates: () => ({}),
    };

    const config: ProjectConfig = {
      name: "test-project",
      description: "",
      features: [],
    };

    await useCase.execute(creator, config, progress);

    expect(gitService.initGitFlow).not.toHaveBeenCalled();
  });

  it("should return next steps from creator", async () => {
    const creator: ProjectCreator = {
      type: "microservice",
      stack: "go",
      installCommand: "go mod tidy",
      nextSteps: "make run",
      getTemplates: () => ({}),
    };

    const config: ProjectConfig = {
      name: "test-project",
      description: "",
      features: [],
    };

    const result = await useCase.execute(creator, config, progress);

    expect(result).toBe("make run");
  });

  it("should report progress at each step", async () => {
    const creator: ProjectCreator = {
      type: "microservice",
      stack: "go",
      installCommand: "go mod tidy",
      nextSteps: "make run",
      getTemplates: () => ({}),
    };

    const config: ProjectConfig = {
      name: "test-project",
      description: "",
      features: ["gitflow"],
    };

    await useCase.execute(creator, config, progress);

    expect(progress.start).toHaveBeenCalledWith("Creating project structure...");
    expect(progress.stop).toHaveBeenCalledWith("Project structure created");
    expect(progress.start).toHaveBeenCalledWith("Installing dependencies...");
    expect(progress.stop).toHaveBeenCalledWith("Dependencies installed");
    expect(progress.start).toHaveBeenCalledWith("Initializing Git Flow...");
    expect(progress.stop).toHaveBeenCalledWith("Git Flow initialized");
  });
});

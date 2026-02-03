import { join } from "path";
import type { ProgressReporter } from "@cjarero183006/cli-builder/interfaces";
import type {
  ProjectConfig,
  ProjectCreator,
  FileService,
  GitService,
  ShellService,
} from "../../domain/interfaces";

export type { ProgressReporter };

export class CreateProjectUseCase {
  constructor(
    private readonly fileService: FileService,
    private readonly gitService: GitService,
    private readonly shellService: ShellService
  ) {}

  async execute(
    creator: ProjectCreator,
    config: ProjectConfig,
    progress: ProgressReporter
  ): Promise<string> {
    const projectPath = join(process.cwd(), config.name);

    progress.start("Creating project structure...");
    const templates = creator.getTemplates(config);
    await this.fileService.createProjectStructure(projectPath, templates);
    progress.stop("Project structure created");

    progress.start("Installing dependencies...");
    await this.shellService.run(creator.installCommand, projectPath);
    progress.stop("Dependencies installed");

    if (config.features.includes("gitflow")) {
      progress.start("Initializing Git Flow...");
      await this.gitService.initGitFlow(projectPath);
      progress.stop("Git Flow initialized");
    }

    return creator.nextSteps;
  }
}

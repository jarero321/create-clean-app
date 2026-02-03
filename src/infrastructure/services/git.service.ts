import type { GitService, ShellService } from "../../domain/interfaces";

export class GitServiceImpl implements GitService {
  constructor(private readonly shell: ShellService) {}

  async initGitFlow(projectPath: string): Promise<void> {
    await this.shell.run("git init", projectPath);
    await this.shell.run("git add .", projectPath);
    await this.shell.run('git commit -m "chore: initial project setup"', projectPath);
    await this.shell.run("git branch -m main", projectPath);
    await this.shell.run("git checkout -b develop", projectPath);
  }
}

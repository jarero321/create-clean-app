export interface GitService {
  initGitFlow(projectPath: string): Promise<void>;
}

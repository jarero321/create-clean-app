export interface ShellService {
  run(command: string, cwd?: string): Promise<void>;
}

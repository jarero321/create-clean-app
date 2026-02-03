import { exec } from "child_process";
import { promisify } from "util";
import type { ShellService } from "../../domain/interfaces";

const execAsync = promisify(exec);

export class ShellServiceImpl implements ShellService {
  async run(command: string, cwd?: string): Promise<void> {
    await execAsync(command, { cwd });
  }
}

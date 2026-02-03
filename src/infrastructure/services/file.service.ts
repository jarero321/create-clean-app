import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import type { FileService } from "../../domain/interfaces";

export class FileServiceImpl implements FileService {
  async createProjectStructure(basePath: string, files: Record<string, string>): Promise<void> {
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = join(basePath, filePath);
      const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
      await mkdir(dir, { recursive: true });
      await writeFile(fullPath, content, "utf-8");
    }
  }
}

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

export async function createDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

export async function writeFileContent(path: string, content: string): Promise<void> {
  await writeFile(path, content, "utf-8");
}

export async function createProjectStructure(basePath: string, structure: Record<string, string>): Promise<void> {
  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = join(basePath, filePath);
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
    await createDir(dir);
    await writeFileContent(fullPath, content);
  }
}

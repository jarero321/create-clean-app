export interface FileService {
  createProjectStructure(basePath: string, files: Record<string, string>): Promise<void>;
}

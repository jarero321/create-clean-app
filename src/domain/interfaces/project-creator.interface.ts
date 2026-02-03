export interface ProjectConfig {
  name: string;
  description: string;
  features: string[];
}

export interface ProjectCreator {
  readonly type: string;
  readonly stack: string;
  readonly installCommand: string;
  readonly nextSteps: string;

  getTemplates(config: ProjectConfig): Record<string, string>;
}

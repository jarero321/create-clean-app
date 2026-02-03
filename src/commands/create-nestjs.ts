import * as p from "@clack/prompts";
import chalk from "chalk";
import { join } from "path";
import { createProjectStructure } from "../utils/files";
import { initGitFlow } from "../utils/git";
import { getNestJSTemplates } from "../templates/nestjs";
import { $ } from "bun";

interface Config {
  name: string;
  description: string;
  features: string[];
}

export async function createNestJS(config: Config): Promise<void> {
  const projectPath = join(process.cwd(), config.name);

  const spinner = p.spinner();

  spinner.start("Creating project structure...");
  const templates = getNestJSTemplates(config);
  await createProjectStructure(projectPath, templates);
  spinner.stop("Project structure created");

  spinner.start("Installing dependencies...");
  await $`cd ${projectPath} && npm install`.quiet();
  spinner.stop("Dependencies installed");

  if (config.features.includes("gitflow")) {
    spinner.start("Initializing Git Flow...");
    await initGitFlow(projectPath);
    spinner.stop("Git Flow initialized");
  }

  console.log();
  p.note(
    `${chalk.cyan("cd")} ${config.name}\n${chalk.cyan("npm run")} start:dev`,
    "Next steps"
  );

  p.outro(chalk.green("Project created successfully!"));
}

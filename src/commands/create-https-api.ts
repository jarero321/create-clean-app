import * as p from "@clack/prompts";
import chalk from "chalk";
import { join } from "path";
import { createProjectStructure } from "../utils/files";
import { initGitFlow } from "../utils/git";
import { getHTTPSAPITemplates } from "../templates/https-api";
import { $ } from "bun";

interface Config {
  name: string;
  description: string;
  features: string[];
}

export async function createHTTPSAPI(config: Config): Promise<void> {
  const projectPath = join(process.cwd(), config.name);

  const spinner = p.spinner();

  spinner.start("Creating project structure...");
  const templates = getHTTPSAPITemplates(config);
  await createProjectStructure(projectPath, templates);
  spinner.stop("Project structure created");

  spinner.start("Installing Go dependencies...");
  await $`cd ${projectPath} && go mod tidy`.quiet();
  spinner.stop("Dependencies installed");

  if (config.features.includes("gitflow")) {
    spinner.start("Initializing Git Flow...");
    await initGitFlow(projectPath);
    spinner.stop("Git Flow initialized");
  }

  console.log();
  p.note(
    `${chalk.cyan("cd")} ${config.name}\n${chalk.cyan("make")} run`,
    "Next steps"
  );

  p.outro(chalk.green("Project created successfully!"));
}

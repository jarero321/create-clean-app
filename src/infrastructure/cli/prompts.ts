import * as p from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import type { ProjectConfig, ProjectCreator } from "../../domain/interfaces";
import type { ProgressReporter } from "../../application/use-cases";

const coolGradient = gradient(["#00d4ff", "#7c3aed", "#f472b6"]);

export function showBanner(): void {
  console.clear();
  const title = figlet.textSync("Clean App", { font: "Small" });
  console.log(coolGradient(title));
  console.log(chalk.dim("  Clean Architecture scaffolding for your projects\n"));
}

export async function selectProjectType(): Promise<string | null> {
  const result = await p.select({
    message: "What do you want to create?",
    options: [
      { value: "mcp", label: "MCP Server", hint: "Model Context Protocol for LLMs" },
      { value: "microservice", label: "Microservice / API", hint: "REST API with Clean Architecture" },
    ],
  });

  if (p.isCancel(result)) {
    p.cancel("Operation cancelled");
    return null;
  }

  return result as string;
}

export async function selectStack(creators: ProjectCreator[], projectType: string): Promise<string | null> {
  const getStackInfo = (stack: string, type: string) => {
    if (type === "mcp") {
      return {
        label: stack === "go" ? "Go" : "NestJS",
        hint: stack === "go" ? "mcp-go SDK, lightweight & fast" : "TypeScript, @modelcontextprotocol/sdk",
      };
    }
    return {
      label: stack === "go" ? "Go" : "NestJS",
      hint: stack === "go" ? "Chi router, lightweight & fast" : "TypeScript, decorators & DI",
    };
  };

  const options = creators.map((c) => {
    const info = getStackInfo(c.stack, projectType);
    return {
      value: c.stack,
      label: info.label,
      hint: info.hint,
    };
  });

  const result = await p.select({
    message: "Select your stack:",
    options,
  });

  if (p.isCancel(result)) {
    p.cancel("Operation cancelled");
    return null;
  }

  return result as string;
}

export async function getProjectConfig(): Promise<ProjectConfig | null> {
  const projectName = await p.text({
    message: "Project name:",
    placeholder: "my-awesome-project",
    validate: (value) => {
      if (!value) return "Project name is required";
      if (!/^[a-z0-9-]+$/.test(value)) return "Use lowercase, numbers and hyphens only";
    },
  });

  if (p.isCancel(projectName)) {
    p.cancel("Operation cancelled");
    return null;
  }

  const description = await p.text({
    message: "Description:",
    placeholder: "A brief description of your project",
  });

  if (p.isCancel(description)) {
    p.cancel("Operation cancelled");
    return null;
  }

  const features = await p.multiselect({
    message: "Select features:",
    options: [
      { value: "gitflow", label: "Git Flow", hint: "Initialize with main/develop branches" },
      { value: "docker", label: "Docker", hint: "Add Dockerfile and docker-compose" },
      { value: "ci", label: "GitHub Actions", hint: "Add CI/CD workflow" },
    ],
    initialValues: ["gitflow"],
  });

  if (p.isCancel(features)) {
    p.cancel("Operation cancelled");
    return null;
  }

  return {
    name: projectName as string,
    description: (description as string) || "",
    features: features as string[],
  };
}

export function createProgressReporter(): ProgressReporter {
  const spinner = p.spinner();
  return {
    start: (message: string) => spinner.start(message),
    stop: (message: string) => spinner.stop(message),
  };
}

export function showNextSteps(projectName: string, nextSteps: string): void {
  console.log();
  p.note(
    `${chalk.cyan("cd")} ${projectName}\n${chalk.cyan(nextSteps)}`,
    "Next steps"
  );
  p.outro(chalk.green("Project created successfully!"));
}

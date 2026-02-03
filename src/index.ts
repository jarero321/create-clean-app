#!/usr/bin/env bun
import * as p from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import { createMCP } from "./commands/create-mcp";
import { createHTTPSAPI } from "./commands/create-https-api";
import { createNestJS } from "./commands/create-nestjs";

const coolGradient = gradient(["#00d4ff", "#7c3aed", "#f472b6"]);

async function main() {
  console.clear();

  const title = figlet.textSync("Clean App", { font: "Small" });
  console.log(coolGradient(title));
  console.log(chalk.dim("  Clean Architecture scaffolding for your projects\n"));

  const projectType = await p.select({
    message: "What do you want to create?",
    options: [
      { value: "mcp", label: "MCP Server", hint: "Model Context Protocol for LLMs" },
      { value: "microservice", label: "Microservice / API", hint: "REST API with Clean Architecture" },
    ],
  });

  if (p.isCancel(projectType)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  let stack: string | symbol = "go";

  if (projectType === "microservice") {
    stack = await p.select({
      message: "Select your stack:",
      options: [
        { value: "go", label: "Go", hint: "Chi router, lightweight & fast" },
        { value: "nestjs", label: "NestJS", hint: "TypeScript, decorators & DI" },
      ],
    });

    if (p.isCancel(stack)) {
      p.cancel("Operation cancelled");
      process.exit(0);
    }
  }

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
    process.exit(0);
  }

  const description = await p.text({
    message: "Description:",
    placeholder: "A brief description of your project",
  });

  if (p.isCancel(description)) {
    p.cancel("Operation cancelled");
    process.exit(0);
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
    process.exit(0);
  }

  const config = {
    name: projectName as string,
    description: (description as string) || "",
    features: features as string[],
  };

  if (projectType === "mcp") {
    await createMCP(config);
  } else if (stack === "nestjs") {
    await createNestJS(config);
  } else {
    await createHTTPSAPI(config);
  }
}

main().catch(console.error);

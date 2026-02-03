#!/usr/bin/env node
import { CreateProjectUseCase } from "./application/use-cases";
import { ShellServiceImpl, FileServiceImpl, GitServiceImpl } from "./infrastructure/services";
import { CreatorRegistry } from "./infrastructure/creators";
import {
  showBannerUI,
  selectProjectType,
  selectStack,
  getProjectConfig,
  createProgressReporter,
  showNextSteps,
} from "./infrastructure/cli";

async function main() {
  showBannerUI();

  const registry = new CreatorRegistry();

  const projectType = await selectProjectType();
  if (!projectType) return;

  let stack = "go";

  const creators = registry.getByType(projectType);
  if (creators.length > 1) {
    const selectedStack = await selectStack(creators, projectType);
    if (!selectedStack) return;
    stack = selectedStack;
  }

  const config = await getProjectConfig();
  if (!config) return;

  const creator = registry.get(projectType, stack);
  if (!creator) {
    console.error(`No creator found for ${projectType}:${stack}`);
    process.exit(1);
  }

  const shellService = new ShellServiceImpl();
  const fileService = new FileServiceImpl();
  const gitService = new GitServiceImpl(shellService);

  const useCase = new CreateProjectUseCase(fileService, gitService, shellService);
  const progress = createProgressReporter();

  const nextSteps = await useCase.execute(creator, config, progress);

  showNextSteps(config.name, nextSteps);
}

main().catch(console.error);

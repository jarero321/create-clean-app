import { $ } from "bun";

export async function initGitFlow(projectPath: string): Promise<void> {
  await $`cd ${projectPath} && git init`.quiet();
  await $`cd ${projectPath} && git add .`.quiet();
  await $`cd ${projectPath} && git commit -m "chore: initial project setup"`.quiet();
  await $`cd ${projectPath} && git branch -m main`.quiet();
  await $`cd ${projectPath} && git checkout -b develop`.quiet();
}

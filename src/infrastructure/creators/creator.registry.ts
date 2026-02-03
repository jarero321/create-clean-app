import type { ProjectCreator } from "../../domain/interfaces";
import { MCPCreator } from "./mcp.creator";
import { NestJSMCPCreator } from "./nestjs-mcp.creator";
import { GoAPICreator } from "./go-api.creator";
import { NestJSCreator } from "./nestjs.creator";

export class CreatorRegistry {
  private creators: Map<string, ProjectCreator> = new Map();

  constructor() {
    this.register(new MCPCreator());
    this.register(new NestJSMCPCreator());
    this.register(new GoAPICreator());
    this.register(new NestJSCreator());
  }

  private register(creator: ProjectCreator): void {
    const key = `${creator.type}:${creator.stack}`;
    this.creators.set(key, creator);
  }

  get(type: string, stack: string): ProjectCreator | undefined {
    return this.creators.get(`${type}:${stack}`);
  }

  getByType(type: string): ProjectCreator[] {
    return Array.from(this.creators.values()).filter((c) => c.type === type);
  }

  getAll(): ProjectCreator[] {
    return Array.from(this.creators.values());
  }
}

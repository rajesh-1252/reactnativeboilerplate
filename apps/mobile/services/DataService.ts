import { ARCHITECTURE_CONFIG } from "@/config/architecture";
import { BaseEntity } from "@/db/schema";
import { Repository } from "@/db/repository";

/**
 * DataService provides a unified interface for data operations.
 * It handles the logic of switching between local (SQLite) and remote (API) sources.
 */
export class DataService<
  T extends BaseEntity,
  CreateInput = any,
  UpdateInput = any,
> {
  constructor(
    private repository: Repository<T>,
    private remoteService: {
      findAll: () => Promise<T[]>;
      findById: (id: string) => Promise<T | null>;
      create: (data: CreateInput) => Promise<T>;
      update: (id: string, data: UpdateInput) => Promise<T | null>;
      delete: (id: string) => Promise<boolean>;
    },
  ) {}

  async findAll(): Promise<T[]> {
    if (ARCHITECTURE_CONFIG.mode === "online-first") {
      try {
        const remoteData = await this.remoteService.findAll();
        // Optionally update cache
        if (ARCHITECTURE_CONFIG.useCache) {
          // This would normally involve complex logic to sync cache
        }
        return remoteData;
      } catch (error) {
        console.error("Remote fetch failed, falling back to cache");
        return this.repository.findAll();
      }
    }
    return this.repository.findAll();
  }

  async findById(id: string): Promise<T | null> {
    if (ARCHITECTURE_CONFIG.mode === "online-first") {
      try {
        return await this.remoteService.findById(id);
      } catch (error) {
        return this.repository.findById(id);
      }
    }
    return this.repository.findById(id);
  }

  async create(data: CreateInput): Promise<T> {
    if (ARCHITECTURE_CONFIG.mode === "online-first") {
      const remoteItem = await this.remoteService.create(data);
      // Update local cache to 'synced'
      return remoteItem;
    }
    return this.repository.create(data as any);
  }

  async update(id: string, data: UpdateInput): Promise<T | null> {
    if (ARCHITECTURE_CONFIG.mode === "online-first") {
      return await this.remoteService.update(id, data);
    }
    return this.repository.update(id, data as any);
  }

  async delete(id: string): Promise<boolean> {
    if (ARCHITECTURE_CONFIG.mode === "online-first") {
      return await this.remoteService.delete(id);
    }
    return this.repository.delete(id);
  }
}

import { PaginatedResponse, PaginationParams } from "@/entities/domain/dto";
import { BaseRepository } from "@/entities/interfaces/repositories/base";
import { BaseService } from "@/entities/interfaces/services/base";
import { BaseEntity } from "@meridiandb/shared/src/entities/base";

export class BaseServiceImpl<T extends BaseEntity, TFilter = object>
  implements BaseService<T, TFilter>
{
  constructor(protected repository: BaseRepository<T, TFilter>) {}

  async create(request: T): Promise<T> {
    return this.repository.create(request);
  }

  async getById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async list(
    filter: TFilter,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    return this.repository.find(filter, pagination);
  }

  async update(id: string, request: Omit<T, keyof BaseEntity>): Promise<T> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new Error(`Entity with id ${id} not found`);
    }

    return this.repository.update(id, request);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

import type { IBase } from '@/interfaces/base.interface'

export abstract class BaseModel {
  id?: string

  createTimestamp?: Date

  updateTimestamp?: Date

  constructor(base: IBase) {
    this.id = base.id
    this.createTimestamp = base.createdTimestamp
    this.updateTimestamp = base.updateTimestamp
  }
}

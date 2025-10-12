import type { IBase } from '@/interfaces/base.interface'

/**
 * Base model
 * @abstract
 * @class BaseModel
 * @description Represents a base model in the system with its properties
 */
export abstract class BaseModel {
  id?: string

  createTimestamp?: Date

  updateTimestamp?: Date

  constructor(base: IBase) {
    this.id = base.id
    this.createTimestamp = base.createTimestamp || new Date()
    this.updateTimestamp = base.updateTimestamp || new Date()
  }
}

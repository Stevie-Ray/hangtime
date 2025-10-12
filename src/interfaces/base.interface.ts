/**
 * Represents the base properties for an entity.
 */
export interface IBase {
  /**
   * Unique identifier for the entity (optional).
   */
  id?: string

  /**
   * The date and time when the entity was created (optional).
   */
  createTimestamp?: Date

  /**
   * The date and time when the entity was last updated (optional).
   */
  updateTimestamp?: Date
}

import getters from '@/store/workouts/workouts.getters'

const state = { workoutDeletionPending: [1, 2, 3] }

describe('workouts module getters', () => {
  describe('isWorkoutDeletionPending', () => {
    it('should return true if the given workout id is marked as pending', () => {
      const result = getters.isWorkoutDeletionPending(state)(1)
      expect(result).toBe(true)
    })

    it('should return false if the given workout id is not marked as pending', () => {
      const result = getters.isWorkoutDeletionPending(state)(4)
      expect(result).toBe(false)
    })
  })
})

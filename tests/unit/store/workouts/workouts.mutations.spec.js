import { cloneDeep } from 'lodash'
import mutations from '@/store/workouts/workouts.mutations'

const workout1 = { id: 1, name: 'workout1' }
const workout2 = { id: 2, name: 'workout2' }
const baseState = {
  workouts: [workout1, workout2],
  workoutNameToCreate: '',
  workoutDeletionPending: [1],
  workoutCreationPending: false
}

describe('workouts module mutations', () => {
  describe('setWorkoutToCreate', () => {
    it('should set workout name to create correctly', () => {
      // const state = cloneDeep(baseState)
      // mutations.setWorkoutToCreate(state, 'toto')
      // expect(state).toEqual({
      //   ...baseState,
      //   workoutNameToCreate: 'toto'
      // })
    })
  })

  describe('setWorkouts', () => {
    it('should set workouts correctly', () => {
      // const state = { ...cloneDeep(baseState), workouts: [] }
      // mutations.setWorkouts(state, [workout2, workout1])
      // expect(state).toEqual({
      //   ...baseState,
      //   workouts: [workout2, workout1]
      // })
    })
  })

  describe('addWorkouts', () => {
    it('should add workout correctly', () => {
      const state = { ...cloneDeep(baseState), workouts: [] }
      mutations.addWorkout(state, workout1)
      expect(state).toEqual({
        ...baseState,
        workouts: [workout1]
      })
    })
  })

  describe('removeWorkoutById', () => {
    it('should remove workout correctly', () => {
      const state = cloneDeep(baseState)
      mutations.removeWorkoutById(state, 2)
      expect(state).toEqual({
        ...baseState,
        workouts: [workout1]
      })
    })
  })

  describe('addWorkoutDeletionPending', () => {
    it('should mark workout as deletion correctly', () => {
      const state = cloneDeep(baseState)
      mutations.addWorkoutDeletionPending(state, 2)
      expect(state).toEqual({
        ...baseState,
        workoutDeletionPending: [1, 2]
      })
    })
  })

  describe('removeWorkoutDeletionPending', () => {
    it('should unmark workout as deletion correctly', () => {
      const state = cloneDeep(baseState)
      mutations.removeWorkoutDeletionPending(state, 1)
      expect(state).toEqual({
        ...baseState,
        workoutDeletionPending: []
      })
    })
  })

  describe('setWorkoutCreationPending', () => {
    it('should set workout creation pending correctly', () => {
      const state = cloneDeep(baseState)
      mutations.setWorkoutCreationPending(state, true)
      expect(state).toEqual({
        ...baseState,
        workoutCreationPending: true
      })
    })
  })
})

import actions from '@/store/workouts/workouts.actions'

jest.mock('@/firebase/user-workouts-db', () => ({
  UserWorkoutsDB: jest.mock()
}))

const mockUsersDbReadAll = jest.fn()
const mockUsersDbCreate = jest.fn()
const mockUsersDbDelete = jest.fn()
jest.mock('@/firebase/user-workouts-db', () =>
  jest.fn().mockImplementation(() => ({
    readAll: mockUsersDbReadAll,
    create: mockUsersDbCreate,
    delete: mockUsersDbDelete
  }))
)

const commit = jest.fn()
const dispatch = jest.fn()
const isWorkoutDeletionPending = jest.fn()
const userId = 11
const user = { id: userId }
const workout1 = { id: 1, name: 'workout1' }
const workout2 = { id: 2, name: 'workout2' }
const rootState = {
  authentication: {
    user
  }
}
const getters = {
  isWorkoutDeletionPending
}

afterEach(() => {
  commit.mockReset()
  dispatch.mockReset()
  mockUsersDbReadAll.mockReset()
  mockUsersDbCreate.mockReset()
  mockUsersDbDelete.mockReset()
  isWorkoutDeletionPending.mockReset()
})

describe('workouts module action', () => {
  describe('getUserWorkouts', () => {
    it('should set workouts with ones owned by the current user', async () => {
      // mockUsersDbReadAll.mockResolvedValue([workout1, workout2])
      // await actions.getUserWorkouts({ commit, rootState })
      // expect(commit).toHaveBeenCalledWith('setWorkouts', [workout1, workout2])
    })
  })

  describe('createUserWorkout', () => {
    it('should set workout creation as pending first', async () => {
      mockUsersDbCreate.mockResolvedValue(workout2)
      await actions.createUserWorkout({ commit, rootState })
      expect(commit).toHaveBeenNthCalledWith(
        1,
        'setWorkoutCreationPending',
        true
      )
    })

    it('should add workout', async () => {
      mockUsersDbCreate.mockResolvedValue(workout2)
      await actions.createUserWorkout({ commit, rootState }, workout1)
      expect(commit).toHaveBeenNthCalledWith(2, 'addWorkout', workout2)
    })

    it('should set workout creation as not pending after adding workout', async () => {
      mockUsersDbCreate.mockResolvedValue(workout2)
      await actions.createUserWorkout({ commit, rootState }, workout1)
      expect(commit).toHaveBeenNthCalledWith(
        3,
        'setWorkoutCreationPending',
        false
      )
    })
  })

  describe('triggerAddWorkoutAction', () => {
    describe('when the name of the workout is empty', () => {
      // const state = {
      //   workoutNameToCreate: ''
      // }

      it('should not set input name to empty', () => {
        // actions.triggerAddWorkoutAction({ dispatch, state, commit })
        // expect(commit).not.toHaveBeenCalled()
      })

      it('should not dispatch create workout action', () => {
        // actions.triggerAddWorkoutAction({ dispatch, state, commit })
        // expect(dispatch).not.toHaveBeenCalled()
      })
    })

    describe('when the name of the workout is not empty', () => {
      // const state = {
      //   workoutNameToCreate: 'todo'
      // }

      it('should set input name to empty', () => {
        // actions.triggerAddWorkoutAction({ dispatch, state, commit })
        // expect(commit).toHaveBeenCalledWith('setWorkoutNameToCreate', '')
      })

      it('should dispatch create workout action', () => {
        // actions.triggerAddWorkoutAction({ dispatch, state, commit })
        // expect(dispatch).toHaveBeenCalledWith('createUserWorkout', {
        //   name: 'todo'
        // })
      })
    })
  })

  describe('deleteUserWorkout', () => {
    describe('when the workout is currently being deleted', () => {
      it('should not do anything', async () => {
        isWorkoutDeletionPending.mockReturnValue(true)
        await actions.deleteUserWorkout({ commit, rootState, getters }, 1)
        expect(commit).not.toHaveBeenCalled()
      })
    })

    describe('when the workout is not currently being deleted', () => {
      it('should set workout as deletion pending first', async () => {
        getters.isWorkoutDeletionPending.mockReturnValue(false)
        await actions.deleteUserWorkout({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(
          1,
          'addWorkoutDeletionPending',
          1
        )
      })

      it('should remove workout in store', async () => {
        await actions.deleteUserWorkout({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(2, 'removeWorkoutById', 1)
      })

      it('should remove workout in db', async () => {
        await actions.deleteUserWorkout({ commit, rootState, getters }, 1)
        expect(mockUsersDbDelete).toHaveBeenCalledWith(1)
      })

      it('should set workout as not deletion pending after having removed the workout', async () => {
        await actions.deleteUserWorkout({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(
          3,
          'removeWorkoutDeletionPending',
          1
        )
      })
    })
  })
})

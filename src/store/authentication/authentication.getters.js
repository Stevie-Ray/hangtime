import { isNil, filter } from 'lodash'

export default {
  isUserLoggedIn: state => !isNil(state.user),
  /**
   * Get stats by id
   */
  statsById: state => payload => filter(state.stats, { id: payload.type })
}

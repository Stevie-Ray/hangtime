import { isNil, filter } from 'lodash'

export default {
  isUserLoggedIn: state => !isNil(state.user),
  /**
   * Get stats by id
   */
  statsById: state => payload => filter(state.stats, { id: payload.type }),
  /**
   * Get stats by id
   * TODO: use statsById
   */
  bestStatsById: state => optionId => {
    const stats = filter(state.stats, { id: optionId.id })
    if (!stats.length) return 0
    return Math.max.apply(
      Math,
      ...stats.map(function(o) {
        return o['value']
      })
    )
  }
}

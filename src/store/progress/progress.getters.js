import { filter, find } from 'lodash'

export default {
  /**
   * Get stats by id
   */
  statsById: state => progressType =>
    filter(state.progress, { type: progressType }),
  /**
   * Get total best stats by id
   */
  totalBestStatsById: (state, getters) => progressType => {
    const progress = filter(state.progress, { type: progressType })
    if (!progress || progress.length <= 0) return 0
    return Math.max.apply(
      Math,
      progress.map(function(o) {
        return getters.bestStatsById(o['id'])
      })
    )
  },
  /**
   * Get best stats by id
   */
  bestStatsById: state => progressId => {
    const progress = find(state.progress, { id: progressId })
    if (!progress['recordings'] || progress['recordings'].length <= 0) return 0
    return Math.max.apply(
      Math,
      progress['recordings'].map(function(o) {
        return o.value
      })
    )
  }
}

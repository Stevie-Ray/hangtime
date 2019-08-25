import { filter, find } from 'lodash'

export default {
  /**
   * Get stats by id
   */
  statsById: state => payload =>
    filter(state.progress, {
      type: payload.type,
      company: payload.settings.hangboards[payload.settings.selected].company,
      hangboard:
        payload.settings.hangboards[payload.settings.selected].hangboard
    }),
  /**
   * Get total best stats by id
   */
  totalBestStatsById: (state, getters) => payload => {
    const progress = filter(state.progress, {
      type: payload.type,
      company: payload.settings.hangboards[payload.settings.selected].company,
      hangboard:
        payload.settings.hangboards[payload.settings.selected].hangboard
    })
    if (!progress || progress.length <= 0) return 0
    return Math.max(
      ...progress.map(function map(o) {
        return getters.bestStatsById(o.id)
      })
    )
  },
  /**
   * Get best stats by id
   */
  bestStatsById: state => progressId => {
    const progress = find(state.progress, { id: progressId })
    if (!progress.recordings || progress.recordings.length <= 0) return 0
    return Math.max(
      ...progress.recordings.map(function map(o) {
        return o.value
      })
    )
  }
}
